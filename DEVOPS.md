# Ratnika — CI/CD & DevOps

End-to-end pipeline: a `git push` builds, tests, scans, containerizes, and
deploys the whole stack, then verifies it is live and monitored.

```
Git Commit → Push to GitHub → GitHub Webhook → Jenkins Pipeline
   → Checkout → Build (Maven) → Unit Test → SonarQube → Trivy
   → Docker Build → Push to Docker Hub
   → docker compose pull → docker compose up -d
   → Nginx reverse proxy → Spring Boot + MySQL + Redis containers
   → Smoke Test → Health Check (Actuator)
   → Prometheus → Grafana → Application Live ✅
```

## Files this adds

| File | Role |
|------|------|
| [`Jenkinsfile`](Jenkinsfile) | The whole declarative pipeline (10 stages) |
| [`ci/trivy-scan.sh`](ci/trivy-scan.sh) | Trivy filesystem + image vulnerability scan |
| [`ci/smoke-test.sh`](ci/smoke-test.sh) | Post-deploy smoke test + Actuator health check |
| [`backend/Dockerfile`](backend/Dockerfile) | Multi-stage build of the Spring Boot jar |
| [`docker-compose.prod.yml`](docker-compose.prod.yml) | Deploy stack — pulls images from Docker Hub |
| [`deploy/.env.example`](deploy/.env.example) | Deploy secrets template (copy → `deploy/.env`) |
| [`deploy/nginx/default.conf`](deploy/nginx/default.conf) | Edge reverse proxy config |
| [`monitoring/grafana/provisioning/`](monitoring/grafana/provisioning) | Auto datasource + dashboard |

## Stack

- **Reverse proxy:** Nginx (single public entrypoint, port 80)
- **App:** Spring Boot 3.3 / Java 21 (`ratnika-backend`)
- **Frontend:** React/Vite served by its own Nginx (`ratnika-frontend`)
- **Data:** MySQL 8 + Redis 7
- **Monitoring:** Prometheus + Grafana (Actuator `/actuator/prometheus`)

> **DB note:** the backend ships the MySQL JDBC driver, so the stack now runs
> **MySQL 8** (previously the compose file mismatched with Postgres). Schema is
> auto-created by Hibernate (`DDL_AUTO=update`).

---

## 1. Prerequisites

**On the Jenkins agent:** `docker`, `docker compose` (v2), `trivy`, and network
access to the deploy host. Jenkins tools configured:

- JDK 21 named **`jdk21`**
- Maven named **`maven3`**

**Plugins:** Docker Pipeline, SonarQube Scanner, Git, Pipeline Utility.

**A running SonarQube** server (added under *Manage Jenkins → System* as
`sonarqube`) and a **Docker Hub** account.

## 2. Credentials (Manage Jenkins → Credentials)

| ID | Type | Value |
|----|------|-------|
| `dockerhub-creds` | Username/password | Docker Hub login |
| `sonar-token` | Secret text | SonarQube user token |

Then edit the `DOCKERHUB_USERNAME` in [`Jenkinsfile`](Jenkinsfile) (or set it as
a global Jenkins env var) to your Docker Hub namespace.

## 3. Deploy secrets

On the deploy host, next to the repo:

```bash
cp deploy/.env.example deploy/.env
# edit deploy/.env — set MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD, JWT_SECRET,
# DOCKERHUB_USERNAME, GRAFANA_PASSWORD, etc.
openssl rand -base64 32   # use for JWT_SECRET
```

## 4. GitHub webhook

Repo → **Settings → Webhooks → Add webhook**:

- Payload URL: `http://<jenkins-host>:8080/github-webhook/`
- Content type: `application/json`
- Events: *Just the push event*

In the Jenkins job enable **GitHub hook trigger for GITScm polling**.

## 5. First run

```bash
git add .
git commit -m "Add CI/CD pipeline"
git remote add origin git@github.com:<you>/ratnika.git
git push -u origin main         # ← triggers the pipeline via the webhook
```

---

## Pipeline stages (what each does)

| # | Stage | Detail |
|---|-------|--------|
| 1 | **Checkout** | `checkout scm`, records short SHA |
| 2 | **Build** | `mvn clean compile` (backend) |
| 3 | **Unit Test** | `mvn test` + JaCoCo coverage; JUnit results published |
| 4 | **SonarQube** | `mvn sonar:sonar`, feeds JaCoCo XML |
| — | **Quality Gate** | waits for Sonar gate; aborts on fail |
| 5 | **Trivy FS** | `trivy fs` — deps/secrets/misconfig, fails on HIGH/CRITICAL |
| 6 | **Docker Build** | builds backend + frontend images, tagged `:$BUILD_NUMBER` + `:latest` |
| 7 | **Trivy Image** | scans both built images |
| 8 | **Push Images** | pushes to Docker Hub with `dockerhub-creds` |
| 9 | **Deploy** | `docker compose -f docker-compose.prod.yml pull && up -d` |
| 10 | **Smoke Test** | `ci/smoke-test.sh` — Actuator health, metrics, SPA, API |

## Live URLs (after deploy)

| Service | URL |
|---------|-----|
| Storefront (via reverse proxy) | http://localhost |
| API | http://localhost/api/v1 |
| Actuator health | http://localhost/actuator/health |
| Prometheus | http://localhost:9090 |
| Grafana (dashboard auto-loaded) | http://localhost:3000 |

## Run stages locally (without Jenkins)

```bash
# Build + test + coverage
cd backend && mvn clean verify

# Security scan
ci/trivy-scan.sh fs .

# Full deploy + verify
cp deploy/.env.example deploy/.env   # edit secrets
docker compose -f docker-compose.prod.yml --env-file deploy/.env up -d
ci/smoke-test.sh http://localhost
```
