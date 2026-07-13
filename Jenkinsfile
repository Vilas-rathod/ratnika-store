// ─────────────────────────────────────────────────────────────────
// Ratnika CI/CD — declarative Jenkins pipeline
//
//   Git push → GitHub webhook → this pipeline:
//   Checkout → Build → Unit Test → SonarQube → Trivy → Docker Build
//   → Push to Docker Hub → Deploy (compose pull/up) → Smoke + Health
//
// Jenkins prerequisites (see DEVOPS.md):
//   Tools (Manage Jenkins → Tools):
//     - JDK named  'jdk21'
//     - Maven named 'maven3'
//   Plugins: Docker Pipeline, SonarQube Scanner, Git
//   SonarQube server configured as 'sonarqube' (Manage Jenkins → System)
//   Credentials (IDs must match below):
//     - 'dockerhub-creds'   (Username/Password: Docker Hub)
//     - 'sonar-token'       (Secret text: SonarQube token)
//   Agent must have: docker, docker compose v2, and trivy on PATH.
// ─────────────────────────────────────────────────────────────────

pipeline {
    agent any

    tools {
        jdk   'jdk21'
        maven 'maven3'
    }

    environment {
        DOCKERHUB_USERNAME = 'your-dockerhub-username'   // ← change or set as a Jenkins global env var
        BACKEND_IMAGE      = "${DOCKERHUB_USERNAME}/ratnika-backend"
        FRONTEND_IMAGE     = "${DOCKERHUB_USERNAME}/ratnika-frontend"
        IMAGE_TAG          = "${env.BUILD_NUMBER}"
        REGISTRY_CREDS     = 'dockerhub-creds'
        SONAR_TOKEN        = credentials('sonar-token')
    }

    options {
        timestamps()
        timeout(time: 45, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    stages {

        // ── 1. Checkout Source Code ──────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                }
                echo "Building commit ${env.GIT_SHA} → tag ${IMAGE_TAG}"
            }
        }

        // ── 2. Build (Maven) ─────────────────────────────────────
        stage('Build') {
            steps {
                dir('backend') {
                    sh 'mvn -B -ntp clean compile'
                }
            }
        }

        // ── 3. Unit Testing ──────────────────────────────────────
        stage('Unit Test') {
            steps {
                dir('backend') {
                    // jacoco prepare-agent + report are bound to the test phase in pom.xml
                    sh 'mvn -B -ntp test'
                }
            }
            post {
                always {
                    junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }

        // ── 4. SonarQube Scan ────────────────────────────────────
        stage('SonarQube') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('sonarqube') {
                        sh '''
                          mvn -B -ntp sonar:sonar \
                            -Dsonar.token=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ── 5. Trivy Security Scan (source / dependencies) ───────
        stage('Trivy FS Scan') {
            steps {
                sh 'ci/trivy-scan.sh fs .'
            }
        }

        // ── 6. Build Docker Images ───────────────────────────────
        stage('Docker Build') {
            steps {
                script {
                    sh """
                      docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest ./backend
                      docker build \
                        --build-arg VITE_USE_MOCK_API=false \
                        --build-arg VITE_API_BASE_URL=/api/v1 \
                        -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ./frontend
                    """
                }
            }
        }

        // ── 7. Trivy Security Scan (built images) ────────────────
        stage('Trivy Image Scan') {
            steps {
                sh "ci/trivy-scan.sh image ${BACKEND_IMAGE}:${IMAGE_TAG}"
                sh "ci/trivy-scan.sh image ${FRONTEND_IMAGE}:${IMAGE_TAG}"
            }
        }

        // ── 8. Push Images to Docker Hub ─────────────────────────
        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', REGISTRY_CREDS) {
                        docker.image("${BACKEND_IMAGE}:${IMAGE_TAG}").push()
                        docker.image("${BACKEND_IMAGE}:${IMAGE_TAG}").push('latest')
                        docker.image("${FRONTEND_IMAGE}:${IMAGE_TAG}").push()
                        docker.image("${FRONTEND_IMAGE}:${IMAGE_TAG}").push('latest')
                    }
                }
            }
        }

        // ── 9. Deploy (compose pull + up -d) ─────────────────────
        stage('Deploy') {
            steps {
                // deploy/.env on the server holds real secrets; IMAGE_TAG is injected here.
                sh '''
                  export IMAGE_TAG=${IMAGE_TAG}
                  export DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME}
                  docker compose -f docker-compose.prod.yml --env-file deploy/.env pull
                  docker compose -f docker-compose.prod.yml --env-file deploy/.env up -d --remove-orphans
                '''
            }
        }

        // ── 10. Smoke Test + Health Check (Actuator) ─────────────
        stage('Smoke Test') {
            steps {
                sh 'ci/smoke-test.sh http://localhost'
            }
        }
    }

    post {
        success {
            echo "✅ Ratnika deployed — ${BACKEND_IMAGE}:${IMAGE_TAG} is live."
        }
        failure {
            echo '❌ Pipeline failed — check the failing stage above.'
        }
        always {
            sh 'docker image prune -f || true'
            cleanWs()
        }
    }
}
