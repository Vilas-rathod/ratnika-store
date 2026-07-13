# Custom Jenkins image for the Ratnika pipeline.
# Adds: Docker CLI + Compose plugin (talks to the host Docker via the mounted
# socket = "Docker outside of Docker"), Trivy, and curl (used by smoke tests).
FROM jenkins/jenkins:lts-jdk21

USER root

# ── Docker CLI + Compose plugin ──────────────────────────────────
RUN apt-get update \
 && apt-get install -y ca-certificates curl gnupg lsb-release \
 && install -m 0755 -d /etc/apt/keyrings \
 && curl -fsSL https://download.docker.com/linux/debian/gpg \
      | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
 && chmod a+r /etc/apt/keyrings/docker.gpg \
 && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
      > /etc/apt/sources.list.d/docker.list \
 && apt-get update \
 && apt-get install -y docker-ce-cli docker-compose-plugin \
 && rm -rf /var/lib/apt/lists/*

# ── Trivy (image / filesystem security scanner) ──────────────────
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh \
      | sh -s -- -b /usr/local/bin

# Stay root so Jenkins can access the mounted Docker socket on Docker Desktop.
# (Fine for a local learning setup; harden for real deployments.)
