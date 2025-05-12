TAG=$(git rev-parse HEAD)
echo "📌 Pinned version to $TAG"

echo "⚙️ Configuring Helm..."
helm repo add traefik https://traefik.github.io/charts
helm repo add bitnami https://charts.bitnami.com/bitnami

echo "🚀 Deploying traefik..."
helm install traefik traefik/traefik --values ./deployment/traefik/values.yaml

echo "🚀 Deploying kafka..."
helm install kafka bitnami/kafka --values ./deployment/kafka/values.yaml

echo "📦 Building auth-gateway..."
docker build -t mrcaidev/telemedicine-auth-gateway:$TAG ./auth-gateway

echo "🚀 Deploying auth-gateway..."
minikube image load mrcaidev/telemedicine-auth-gateway:$TAG
helm install auth-gateway ./deployment/auth-gateway --set image=mrcaidev/telemedicine-auth-gateway:$TAG

echo "📦 Building notification..."
docker build -t mrcaidev/telemedicine-notification:$TAG ./notification

echo "🚀 Deploying notification..."
minikube image load mrcaidev/telemedicine-notification:$TAG
helm install notification ./deployment/notification --set image=mrcaidev/telemedicine-notification:$TAG

echo "🚀 Deploying user-postgres..."
kubectl create cm user-postgres-initdb --from-file=./user/init/postgres
helm install user-postgres bitnami/postgresql --values ./deployment/user-postgres/values.yaml

echo "📦 Building user..."
docker build -t mrcaidev/telemedicine-user:$TAG ./user

echo "🚀 Deploying user..."
minikube image load mrcaidev/telemedicine-user:$TAG
helm install user ./deployment/user --set image=mrcaidev/telemedicine-user:$TAG

echo "🚀 Deploying appointment-postgres..."
kubectl create cm appointment-postgres-initdb --from-file=./appointment/init/postgres
helm install appointment-postgres bitnami/postgresql --values ./deployment/appointment-postgres/values.yaml

echo "📦 Building appointment..."
docker build -t mrcaidev/telemedicine-appointment:$TAG ./appointment

echo "🚀 Deploying appointment..."
minikube image load mrcaidev/telemedicine-appointment:$TAG
helm install appointment ./deployment/appointment --set image=mrcaidev/telemedicine-appointment:$TAG

echo "🚀 Deploying smart-assistant-mongo..."
helm install smart-assistant-mongo bitnami/mongodb --values ./deployment/smart-assistant-mongo/values.yaml

echo "🚀 Deploying smart-assistant-redis..."
helm install smart-assistant-redis bitnami/redis --values ./deployment/smart-assistant-redis/values.yaml

echo "📦 Building smart-assistant..."
docker build -t mrcaidev/telemedicine-smart-assistant:$TAG ./smart-assistant

echo "🚀 Deploying smart-assistant..."
minikube image load mrcaidev/telemedicine-smart-assistant:$TAG
helm install smart-assistant ./deployment/smart-assistant --set image=mrcaidev/telemedicine-smart-assistant:$TAG
