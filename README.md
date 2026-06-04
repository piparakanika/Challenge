# DevOps Engineer Infrastructure Challenge

## Project Overview

This project demonstrates a production-style application deployment using Docker, Kubernetes, Jenkins, and MongoDB.

The objective was to build a simple application stack and showcase:

- Containerization
- Kubernetes Deployment
- CI/CD Automation
- Reliability Improvements
- Operational Debugging

---

# Tech Stack

- Node.js
- MongoDB
- Docker
- Kubernetes (Kind)
- Jenkins
- GitHub
- Docker Hub
- AWS EC2

---

# Architecture

```text
Developer
    |
    v
GitHub Repository
    |
    v
Jenkins Pipeline
    |
    +--> Build Docker Image
    |
    +--> Push Image to Docker Hub
    |
    +--> Deploy to Kubernetes
    |
    v
Kubernetes Cluster (Kind)
    |
    +--> Backend Deployment
    |
    +--> MongoDB Deployment
    |
    v
Backend Service
    |
    v
Users
```

---

# Project Structure

```text
.
├── app.js
├── package.json
├── Dockerfile
├── Jenkinsfile
├── README.md
└── k8s
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── mongodb-deployment.yaml
    └── mongodb-service.yaml
```

---

# Implementation Steps

## 1. Infrastructure Setup

An AWS EC2 instance was created as the host environment.

The following tools were installed:

- Git
- Docker
- kubectl
- Kind (Kubernetes in Docker)
- Jenkins
- Java (Required for Jenkins)

Verification:

```bash
docker --version
kubectl version --client
kind version
```

---

## 2. Application Development

A simple Node.js backend application was created.

### Endpoints

```text
/
→ DevOps Challenge Running

/health
→ healthy
```

### Application Files

```text
app.js
package.json
```

MongoDB connectivity is configured using environment variables.

---

## 3. Docker Containerization

A Dockerfile was created to containerize the application.

### Build Docker Image

```bash
docker build -t kanika2905/devops-app:latest .
```

### Run Container

```bash
docker run -d \
-p 3000:3000 \
-e MONGO_URI=<mongodb-uri> \
kanika2905/devops-app:latest
```

---

## 4. Docker Hub Integration

A Docker Hub repository was created.

### Login

```bash
docker login
```

### Push Image

```bash
docker push kanika2905/devops-app:latest
```

Docker Hub Repository:

```text
kanika2905/devops-app
```

---

## 5. Kubernetes Cluster Setup

A Kubernetes cluster was created using Kind.

### Create Cluster

```bash
kind create cluster --name challenge
```

### Verify Cluster

```bash
kubectl get nodes
```

---

## 6. Kubernetes Deployment

### MongoDB Resources

```bash
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml
```

### Backend Resources

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
```

### Verify Deployment

```bash
kubectl get pods
kubectl get svc
kubectl get deployment
```

---

## 7. Reliability Improvement

To improve application reliability, Readiness and Liveness Probes were implemented.

### Readiness Probe

Ensures traffic is routed only to healthy pods.

### Liveness Probe

Automatically restarts unhealthy containers.

Example Configuration:

```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 3000

livenessProbe:
  httpGet:
    path: /health
    port: 3000
```

Benefits:

- Improved availability
- Self-healing capability
- Reduced downtime

---

## 8. Source Control

The application source code was pushed to GitHub.

### Git Commands

```bash
git init
git add .
git commit -m "Initial Commit"
git push origin main
```

Repository includes:

- Application Code
- Dockerfile
- Kubernetes Manifests
- Jenkinsfile
- README

---

## 9. Jenkins Setup

Jenkins was installed on the EC2 instance.

### Plugins Installed

- Git
- Pipeline
- Docker Pipeline
- Credentials Binding

### Credentials Configured

Docker Hub credentials were stored securely in Jenkins.

Credential ID:

```text
dockerhub-credentials
```

---

## 10. CI/CD Pipeline

A Jenkins Pipeline was created using a Jenkinsfile stored in GitHub.

### Pipeline Stages

#### Build

Builds the Docker image.

```groovy
docker build -t kanika2905/devops-app:latest .
```

#### Push

Pushes the image to Docker Hub.

```groovy
docker push kanika2905/devops-app:latest
```

#### Deploy

Triggers a rolling restart of the Kubernetes deployment.

```groovy
kubectl rollout restart deployment backend
```

### CI/CD Flow

```text
GitHub
   |
   v
Jenkins
   |
   +--> Build Docker Image
   |
   +--> Push Docker Image
   |
   +--> Deploy to Kubernetes
   |
   v
Updated Application
```

---

## Jenkinsfile

```groovy
pipeline {
    agent any

    environment {
        IMAGE = "kanika2905/devops-app"
    }

    stages {

        stage('Build') {
            steps {
                sh 'docker build -t $IMAGE:latest .'
            }
        }

        stage('Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )
                ]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'kubectl rollout restart deployment backend'
            }
        }
    }
}
```

---

## 11. Deployment Verification

### Port Forward

```bash
kubectl port-forward svc/backend-service 8081:80
```

### Verify Application

```bash
curl localhost:8081
```

Output:

```text
DevOps Challenge Running
```

### Verify Health Endpoint

```bash
curl localhost:8081/health
```

Output:

```text
healthy
```

---

## 12. Failure Simulation & Debugging

### Failure Introduced

The readiness probe path was intentionally changed from:

```yaml
path: /health
```

to:

```yaml
path: /wrong-health
```

### Symptoms

```bash
kubectl get pods
```

Pods remained:

```text
0/1 Ready
```

### Investigation

Checked application logs:

```bash
kubectl logs <pod-name>
```

Checked pod events:

```bash
kubectl describe pod <pod-name>
```

Observed:

```text
Readiness probe failed
HTTP probe failed with status code 404
```

### Root Cause

The readiness probe was configured with an incorrect endpoint.

### Resolution

Restored the correct health endpoint:

```yaml
path: /health
```

Re-applied the deployment:

```bash
kubectl apply -f k8s/backend-deployment.yaml
```

Pods became healthy and traffic resumed successfully.

---

# Trade-offs

### Simplifications

- Used Kind instead of a production multi-node cluster.
- Used a single MongoDB instance.
- Used the latest image tag for simplicity.

### Limitations at Scale

- Single-node cluster creates a single point of failure.
- MongoDB is not highly available.
- No centralized monitoring or alerting.

### Production Improvements

- Amazon EKS / AKS / GKE
- Prometheus & Grafana
- Kubernetes Secrets
- Horizontal Pod Autoscaler
- Ingress Controller
- MongoDB Replica Set
- Image Versioning & Rollback Strategy

---

# Outcome

Successfully implemented:

- Docker Containerization
- Kubernetes Deployment
- Jenkins CI/CD Pipeline
- Docker Hub Integration
- Readiness & Liveness Probes
- Failure Simulation & Debugging
- Production-Oriented DevOps Workflow
