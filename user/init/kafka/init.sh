kafka-topics.sh --bootstrap-server kafka:9092 --create --if-not-exists --topic PatientCreated
kafka-topics.sh --bootstrap-server kafka:9092 --create --if-not-exists --topic PatientUpdated
kafka-topics.sh --bootstrap-server kafka:9092 --create --if-not-exists --topic PatientDeleted
kafka-topics.sh --bootstrap-server kafka:9092 --create --if-not-exists --topic DoctorCreated
kafka-topics.sh --bootstrap-server kafka:9092 --create --if-not-exists --topic DoctorUpdated
kafka-topics.sh --bootstrap-server kafka:9092 --create --if-not-exists --topic DoctorDeleted
kafka-topics.sh --bootstrap-server kafka:9092 --create --if-not-exists --topic EmailRequested
