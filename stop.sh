helm uninstall $(helm list --short)
kubectl delete cm --all
kubectl delete pvc --all
kubectl delete pv --all
