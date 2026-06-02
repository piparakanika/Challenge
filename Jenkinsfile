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
