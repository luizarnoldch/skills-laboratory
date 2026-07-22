# DevOps — Steps to Complete

Use 5 parent tasks in this exact order:

- [ ] **1.0 Container Build**
  Write or update `Dockerfile`, `.dockerignore`, and multi-stage build if needed.
  Define health check, non-root user, and minimal base image.

- [ ] **2.0 Compose / Local Orchestration**
  Update `docker-compose.yml` or local k8s manifests with new service definition,
  environment variables, secrets, and volume mounts.

- [ ] **3.0 CI/CD Pipeline**
  Add or update workflow in `.github/workflows/` or `.gitlab-ci.yml`.
  Cover: test, build, push, deploy, and rollback triggers.

- [ ] **4.0 Infrastructure / Deployment**
  Update Terraform, Helm charts, or platform manifests (K8s Deployments, Services, Ingress).
  Include resource limits, replicas, and autoscaling rules.

- [ ] **5.0 Monitoring & Observability**
  Add service health checks, logging, metrics (Prometheus), alerts, and tracing hooks.

Each parent task breaks into sub-tasks with **Context**, **Files Related**, and **Tools**.

If a step is not needed → mark done, write "not required".
