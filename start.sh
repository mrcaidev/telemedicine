TAG=$(git rev-parse HEAD)
echo "📌 Pinned version to ${TAG}"

echo "⚙️ Configuring Helm..."
helm repo add traefik https://traefik.github.io/charts
helm repo add bitnami https://charts.bitnami.com/bitnami

echo "🚀 Deploying Kafka..."
helm install kafka bitnami/kafka --values ./deployment/kafka/values-development.yaml

echo "🚀 Deploying PostgreSQL..."
helm install postgresql bitnami/postgresql --values ./deployment/postgresql/values-development.yaml

echo "🚀 Deploying MongoDB..."
helm install mongodb bitnami/mongodb --values ./deployment/mongodb/values-development.yaml

echo "🚀 Deploying Redis..."
helm install redis bitnami/redis --values ./deployment/redis/values-development.yaml

echo "🚀 Deploying Traefik..."
helm install traefik traefik/traefik --values ./deployment/traefik/values.yaml --values ./deployment/traefik/values-development.yaml

echo "📦 Building Auth Gateway..."
docker build -t mrcaidev/telemedicine-auth-gateway:${TAG} ./auth-gateway

echo "🚀 Deploying Auth Gateway..."
minikube image load mrcaidev/telemedicine-auth-gateway:${TAG}
helm install auth-gateway ./deployment/auth-gateway --values ./deployment/auth-gateway/values-development.yaml --set image=mrcaidev/telemedicine-auth-gateway:${TAG}

echo "📦 Building Notification..."
docker build -t mrcaidev/telemedicine-notification:${TAG} ./notification

echo "🚀 Deploying Notification..."
minikube image load mrcaidev/telemedicine-notification:${TAG}
helm install notification ./deployment/notification --values ./deployment/notification/values-development.yaml --set image=mrcaidev/telemedicine-notification:${TAG}

echo "📦 Building User..."
docker build -t mrcaidev/telemedicine-user:${TAG} ./user

echo "🚀 Deploying User..."
minikube image load mrcaidev/telemedicine-user:${TAG}
helm install user ./deployment/user --values ./deployment/user/values-development.yaml --set image=mrcaidev/telemedicine-user:${TAG}

echo "🧬 Initializing User..."
kubectl run postgresql-init-user --image docker.io/bitnami/postgresql --env="PGPASSWORD=user_password" --command -- sleep infinity
kubectl cp ./user/init/postgres/* postgresql-init-user:/tmp
kubectl exec postgresql-init-user -- psql -h postgresql -p 5432 -U user_username -d user_db -f /tmp/init.sql
kubectl delete pod postgresql-init-user

echo "📦 Building Appointment..."
docker build -t mrcaidev/telemedicine-appointment:${TAG} ./appointment

echo "🚀 Deploying Appointment..."
minikube image load mrcaidev/telemedicine-appointment:${TAG}
helm install appointment ./deployment/appointment --values ./deployment/appointment/values-development.yaml --set image=mrcaidev/telemedicine-appointment:${TAG}

echo "🧬 Initializing Appointment..."
kubectl run postgresql-init-appointment --image docker.io/bitnami/postgresql --env="PGPASSWORD=appointment_password" --command -- sleep infinity
kubectl cp ./appointment/init/postgres/* postgresql-init-appointment:/tmp
kubectl exec postgresql-init-appointment -- psql -h postgresql -p 5432 -U appointment_username -d appointment_db -f /tmp/init.sql
kubectl delete pod postgresql-init-appointment

echo "📦 Building Smart Assistant..."
docker build -t mrcaidev/telemedicine-smart-assistant:${TAG} ./smart-assistant

echo "🚀 Deploying Smart Assistant..."
minikube image load mrcaidev/telemedicine-smart-assistant:${TAG}
helm install smart-assistant ./deployment/smart-assistant --values ./deployment/smart-assistant/values-development.yaml --set image=mrcaidev/telemedicine-smart-assistant:${TAG}
