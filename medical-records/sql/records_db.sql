/*
 Navicat Premium Dump SQL

 Source Server         : localhost3306
 Source Server Type    : MySQL
 Source Server Version : 90300 (9.3.0)
 Source Host           : localhost:3306
 Source Schema         : records_db

 Target Server Type    : MySQL
 Target Server Version : 90300 (9.3.0)
 File Encoding         : 65001

 Date: 21/05/2025 16:26:01
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for diagnoses
-- ----------------------------
DROP TABLE IF EXISTS `diagnoses`;
CREATE TABLE `diagnoses` (
  `code` varchar(32) NOT NULL COMMENT '诊断编码',
  `description` varchar(128) NOT NULL COMMENT '诊断描述',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='诊断编码表';

-- ----------------------------
-- Records of diagnoses
-- ----------------------------
BEGIN;
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('10509002', 'Acute bronchitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('105531004', 'Housing unsatisfactory (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('10939881000119105', 'Unhealthy alcohol drinking behavior (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('109570002', 'Primary dental caries (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('109838007', 'Overlapping malignant neoplasm of colon (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('110030002', 'Concussion injury of brain (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('1121000119107', 'Chronic neck pain (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('1187604002', 'Serving in military service (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('124171000119105', 'Chronic intractable migraine without aura (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('125601008', 'Injury of knee (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('125605004', 'Fracture of bone (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('126906006', 'Neoplasm of prostate (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('127013003', 'Disorder of kidney due to diabetes mellitus (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('128613002', 'Seizure disorder (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('1290882004', 'History of seizure (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('153351000119102', 'History of peripheral stem cell transplant (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('1551000119108', 'Nonproliferative retinopathy due to type 2 diabetes mellitus (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('157141000119108', 'Proteinuria due to type 2 diabetes mellitus (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('160903007', 'Full-time employment (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('160904001', 'Part-time employment (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('160968000', 'Risk activity involvement (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('16114001', 'Fracture of ankle (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('161665007', 'History of renal transplant (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('161744009', 'Past pregnancy history of miscarriage (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('162864005', 'Body mass index 30+ - obesity (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('183996000', 'Sterilization requested (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('185086009', 'Chronic obstructive bronchitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('18718003', 'Gingival disease (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('19169002', 'Miscarriage in first trimester (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('192127007', 'Child attention deficit disorder (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('195662009', 'Acute viral pharyngitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('196416002', 'Impacted molars (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('197927001', 'Recurrent urinary tract infection (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('198992004', 'Eclampsia in pregnancy (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('201834006', 'Localized  primary osteoarthritis of the hand (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('224295006', 'Only received primary school education (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('224299000', 'Received higher education (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('230690007', 'Cerebrovascular accident (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('233604007', 'Pneumonia (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('233678006', 'Childhood asthma (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('237602007', 'Metabolic syndrome X (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('239872002', 'Osteoarthritis of hip (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('239873007', 'Osteoarthritis of knee (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('24079001', 'Atopic dermatitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('241929008', 'Acute allergic reaction (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('246677007', 'Passive conjunctival congestion (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('248595008', 'Sputum finding (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('254837009', 'Malignant neoplasm of breast (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('262574004', 'Bullet wound (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('263102004', 'Fracture subluxation of wrist (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('263172003', 'Fracture of mandible (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('266934004', 'Transport problem (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('266948004', 'Has a criminal record (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('267020005', 'History of tubal ligation (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('267102003', 'Sore throat (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('267253006', 'Fetus with chromosomal abnormality (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('271737000', 'Anemia (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('271825005', 'Respiratory distress (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('274531002', 'Abnormal findings diagnostic imaging heart+coronary circulat (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('278558000', 'Dental filling lost (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('278588009', 'Fractured dental filling (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('278598003', 'Leaking dental filling (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('278602001', 'Loose dental filling (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('278860009', 'Chronic low back pain (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('283371005', 'Laceration of forearm (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('283385000', 'Laceration of thigh (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('283545005', 'Gunshot wound (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('284549007', 'Laceration of hand (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('284551006', 'Laceration of foot (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('302870006', 'Hypertriglyceridemia (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('307426000', 'Acute infective cystitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('30832001', 'Rupture of patellar tendon (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('312608009', 'Laceration - injury (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('314529007', 'Medication review due (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('315268008', 'Suspected prostate cancer (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('32911000', 'Homeless (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('33737001', 'Fracture of rib (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('359817006', 'Closed fracture of hip (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('35999006', 'Blighted ovum (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('361055000', 'Misuses drugs (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('367498001', 'Seasonal allergic rhinitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('368581000119106', 'Neuropathy due to type 2 diabetes mellitus (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('36955009', 'Loss of taste (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('36971009', 'Sinusitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('370143000', 'Major depressive disorder (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('370247008', 'Facial laceration (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('37320007', 'Loss of teeth (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('384709000', 'Sprain (morphologic abnormality)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('386661006', 'Fever (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('389087006', 'Hypoxemia (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('398254007', 'Pre-eclampsia (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('39848009', 'Whiplash injury to neck (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('39898005', 'Sleep disorder (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('399211009', 'History of myocardial infarction (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('399261000', 'History of coronary artery bypass grafting (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('40055000', 'Chronic sinusitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('401303003', 'Acute ST segment elevation myocardial infarction (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('403190006', 'Epidermal burn of skin (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('408512008', 'Body mass index 40+ - severely obese (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('414545008', 'Ischemic heart disease (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('422034002', 'Retinopathy due to type 2 diabetes mellitus (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('422650009', 'Social isolation (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('423315002', 'Limited social contact (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('424393004', 'Reports of violence in the environment (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('427898007', 'Infection of tooth (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('428251008', 'History of appendectomy (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('431855005', 'Chronic kidney disease stage 1 (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('431856006', 'Chronic kidney disease stage 2 (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('431857002', 'Chronic kidney disease stage 4 (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('433144002', 'Chronic kidney disease stage 3 (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('43878008', 'Streptococcal sore throat (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('44054006', 'Diabetes mellitus type 2 (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('443165006', 'Osteoporotic fracture of bone (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('44465007', 'Sprain of ankle (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('444814009', 'Viral sinusitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('446096008', 'Perennial allergic rhinitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('446654005', 'Refugee (person)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('45816000', 'Pyelonephritis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('46177005', 'End-stage renal disease (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('46752004', 'Torus palatinus (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('473461003', 'Educated to high school level (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('47693006', 'Rupture of appendix (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('48333001', 'Burn injury (morphologic abnormality)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('48724000', 'Mitral valve regurgitation (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('49727002', 'Cough (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('55680006', 'Drug overdose');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('55822004', 'Hyperlipidemia (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('5602001', 'Opioid abuse (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('57676002', 'Joint pain (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('58150001', 'Fracture of clavicle (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('59621000', 'Essential hypertension (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('61804006', 'Alveolitis of jaw (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('62106007', 'Concussion with no loss of consciousness (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('64859006', 'Osteoporosis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('6525002', 'Dependent drug abuse (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('65363002', 'Otitis media (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('65966004', 'Fracture of forearm (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('66383009', 'Gingivitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('67787004', 'Tongue tie (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('68235000', 'Nasal congestion (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('68496003', 'Polyp of colon (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('68962001', 'Muscle pain (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('698303004', 'Awaiting transplantation of bone marrow (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('698306007', 'Awaiting transplantation of kidney (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('706893006', 'Victim of intimate partner abuse (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('70704007', 'Sprain of wrist (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('713197008', 'Recurrent rectal polyp (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('713458007', 'Lack of access to transportation (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('714628002', 'Prediabetes (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('7200002', 'Alcoholism (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('72892002', 'Normal pregnancy (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('73430006', 'Sleep apnea (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('73438004', 'Unemployed (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('73595000', 'Stress (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('741062008', 'Not in labor force (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('74400008', 'Appendicitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('75498004', 'Acute bacterial sinusitis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('78275009', 'Obstructive sleep apnea syndrome (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('80394007', 'Hyperglycemia (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('80583007', 'Severe anxiety (panic) (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('81629009', 'Traumatic dislocation of temporomandibular joint (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('82423001', 'Chronic pain (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('840539006', 'Disease caused by severe acute respiratory syndrome coronavirus 2 (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('840544004', 'Suspected disease caused by Severe acute respiratory coronavirus 2 (situation)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('84229001', 'Fatigue (finding)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('84757009', 'Epilepsy (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('85116003', 'Miscarriage in second trimester (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('87433001', 'Pulmonary emphysema (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('90460009', 'Injury of neck (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('90560007', 'Inflammatory disorder due to increased blood urate level (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('90781000119102', 'Microalbuminuria due to type 2 diabetes mellitus (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('91302008', 'Sepsis (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('92691004', 'Carcinoma in situ of prostate (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('93143009', 'Leukemia  disease (disorder)');
INSERT INTO `diagnoses` (`code`, `description`) VALUES ('95417003', 'Primary fibromyalgia syndrome (disorder)');
COMMIT;

-- ----------------------------
-- Table structure for lab_tests
-- ----------------------------
DROP TABLE IF EXISTS `lab_tests`;
CREATE TABLE `lab_tests` (
  `code` varchar(32) NOT NULL COMMENT '检验项目编码',
  `name` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '检验项目名称',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='检验项目表';

-- ----------------------------
-- Records of lab_tests
-- ----------------------------
BEGIN;
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('103697008', 'Patient referral for dental care (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('103750000', 'Sleep apnea assessment (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('10383002', 'Counseling for termination of pregnancy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('104091002', 'Hemogram  automated  with red blood cells  white blood cells  hemoglobin  hematocrit  indices  platelet count  and manual white blood cell differential (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('104326007', 'Measurement of Varicella-zoster virus antibody (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('104375008', 'Hepatitis C antibody  confirmatory test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('104435004', 'Screening for occult blood in feces (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('110467000', 'Pre-surgery testing (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('112790001', 'Nasal sinus endoscopy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('11466000', 'Cesarean section (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('116861002', 'Transfusion of fresh frozen plasma (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('117010004', 'Urine culture (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('117015009', 'Throat culture (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('118001005', 'Streptococcus pneumoniae group B antigen assay (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('122548005', 'Biopsy of breast (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('122856003', 'Oral examination (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('1256042007', 'Restoration of tooth with coverage of all cusps using dental filling material (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('1259293006', 'Application of composite dental filling material to dentin of tooth following fracture of tooth (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('1260009003', 'Removal of supragingival plaque and calculus from all teeth using dental instrument (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('1260010008', 'Removal of subgingival plaque and calculus from all teeth using dental instrument (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('1263416007', 'Removal of intrauterine contraceptive device (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('1269321004', 'Fitting of denture (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('127783003', 'Spirometry (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('1290407002', 'Plain X-ray of knee region (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('1290459008', 'Plain X-ray of ankle region (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('133899007', 'Postoperative care (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('14736009', 'History and physical examination with evaluation and management of patient (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('14768001', 'Peripheral blood smear interpretation (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('15081005', 'Pulmonary rehabilitation (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('1571000087109', 'Ultrasonography of bilateral breasts (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('162676008', 'Brief general examination (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('165355002', 'Patient informed - test result (situation)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('165829005', 'Gonorrhea infection titer test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('167271000', 'Urine protein test');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('168594001', 'Plain X-ray of clavicle (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('169230002', 'Ultrasound scan for fetal viability (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('169553002', 'Insertion of subcutaneous contraceptive (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('169673001', 'Antenatal RhD antibody screening (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('171207006', 'Depression screening (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('173291009', 'Simple extraction of tooth (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('179632003', 'Closed reduction of dislocation of temporomandibular joint (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('180256009', 'Subcutaneous immunotherapy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('183444007', 'Referral for further care (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('183519002', 'Referral to cardiology service (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('185087000', 'Notifications (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('18946005', 'Epidural anesthesia (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('19589009', 'Radiography of mandible (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('200619008', 'Comprehensive interview and evaluation (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('223470000', 'Discussion about signs and symptoms (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('223484005', 'Discussion about treatment (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('223487003', 'Discussion about options (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('223495004', 'Preparation of patient for procedure (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('225158009', 'Auscultation of the fetal heart (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('22523008', 'Vasectomy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('225362009', 'Dental care (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('225386006', 'Pre-discharge assessment (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('228557008', 'Cognitive and behavioral therapy (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('229064008', 'Movement therapy (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('23426006', 'Measurement of respiratory function (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('234336002', 'Hemopoietic stem cell transplant (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('234745004', 'Take oral or dental impression (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('236974004', 'Instrumental delivery (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('23745001', 'Documentation procedure (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('23933004', 'Excision of lingual frenum (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('241046008', 'Dental plain X-ray bitewing (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('241055006', 'Mammogram - symptomatic (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('243063003', 'Postoperative procedure education (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('243085009', 'Oral health education (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('24623002', 'Screening mammography (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('24832002', 'Closed reduction of mandibular fracture (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('252160004', 'Standard pregnancy test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('252482003', 'Stair-climbing test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('25656009', 'Physical examination  complete (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('261352009', 'Face mask (physical object)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('265764009', 'Renal dialysis (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('266753000', 'Referral for laboratory tests (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('268533009', 'Sterilization education (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('268556000', 'Urine screening for glucose (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('269828009', 'Syphilis infectious titer test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('269911007', 'Sputum examination (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('271280005', 'Removal of endotracheal tube (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('271442007', 'Fetal anatomy study (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('274031008', 'Rectal polypectomy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('274474001', 'Bone immobilization (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('274788003', 'Examination of gingivae (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('274804006', 'Evaluation of uterine fundal height (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('275833003', 'Alpha-fetoprotein test - antenatal (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('28163009', 'Skin test for tuberculosis  Tine test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('281789004', 'Antibiotic therapy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('284053004', 'Tooth socket procedure (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('287664005', 'Ligation of bilateral fallopian tubes (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('288086009', 'Suture open wound (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('29303009', 'Electrocardiographic procedure (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('301807007', 'Removal of subcutaneous contraceptive (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('302761001', 'Walking exercise test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('304531008', 'Treatment side effects education (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('304532001', 'Treatment failure risk education (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('305428000', 'Admission to orthopedic department (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('306185001', 'Referral to cardiac surgery service (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('306316000', 'Referral to transplant surgeon (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('306706006', 'Discharge to ward (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('308283009', 'Discharge from hospital (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('310417005', 'Certification procedure (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('310861008', 'Chlamydia antigen test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('311555007', 'Speech and language therapy regime (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('31208007', 'Medical induction of labor (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('312681000', 'Bone density scan (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('313191000', 'Injection of epinephrine (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('314098000', 'Rubella screening test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('315639002', 'Initial patient assessment (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('31676001', 'Human immunodeficiency virus antigen test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('33195004', 'External beam radiation therapy procedure (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('33367005', 'Angiography of coronary artery (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('33633005', 'Prescription of drug (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('34043003', 'Dental consultation and report (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('35025007', 'Manual pelvic examination (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('359672006', 'Median sternotomy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('367336001', 'Chemotherapy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('367494004', 'Premature birth of newborn (finding)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('370789001', 'Development of individualized plan of care (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('370995009', 'Health risks education (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('371908008', 'Oxygen administration by mask (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('37542007', 'Posttreatment stabilization  orthodontic device (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('3802001', 'Dental application of desensitizing medicament (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('384700001', 'Injection of tetanus antitoxin (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('385763009', 'Hospice care (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('386053000', 'Evaluation procedure (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('386394001', 'Pregnancy termination care (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('386478007', 'Triage: emergency center (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('386516004', 'Anticipatory guidance (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('392021009', 'Lumpectomy of breast (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('392091000', 'Care regimes assessment (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('392247006', 'Insertion of catheter into artery (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('394894008', 'Pre-operative chemotherapy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('395123002', 'Urine screening test for diabetes (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('395142003', 'Allergy screening test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('396487001', 'Sentinel lymph node biopsy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('399014008', 'Administration of vaccine product containing only Bordetella pertussis and Clostridium tetani and Corynebacterium diphtheriae antigens (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('399208008', 'Plain X-ray of chest (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('40701008', 'Echocardiography (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('409023009', 'Professional / ancillary services care (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('410006001', 'Digital examination of rectum (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('410299006', 'Lab findings education  guidance  and counseling (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('410401003', 'Nursing care/supplementary surveillance (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('410538000', 'Scheduling (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('410770002', 'Administration of anesthesia for procedure (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('415070008', 'Percutaneous coronary intervention (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('415300000', 'Review of systems (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('417511005', 'Referral to home health care service (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('418824004', 'Off-pump coronary artery bypass (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('428211000124100', 'Assessment of substance use (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('428830000', 'Pretransplant evaluation of kidney recipient (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('429609002', 'Lung volume reduction surgery (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('430193006', 'Medication reconciliation (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('430701006', 'Resuscitation using intravenous fluid (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('43075005', 'Partial resection of colon (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('431182000', 'Placing subject in prone position (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('433112001', 'Percutaneous mechanical thrombectomy of portal vein using fluoroscopic guidance with contrast (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('433114000', 'Human epidermal growth factor receptor 2 gene detection by immunohistochemistry (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('434363004', 'Human epidermal growth factor receptor 2 gene detection by fluorescence in situ hybridization (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('440546007', 'Discussion about pregnancy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('441550005', 'Urinalysis with reflex to microscopy and culture (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('443497002', 'Excision of sentinel lymph node (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('443529005', 'Detection of chromosomal aneuploidy in prenatal amniotic fluid specimen using fluorescence in situ hybridization screening technique (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('44608003', 'Blood group typing (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('448337001', 'Telemedicine consultation with patient (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('449214001', 'Transfer to stepdown unit (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('456191000124101', 'Postoperative care for dental procedure (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('46706006', 'Replacement of contraceptive intrauterine device (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('473220001', 'Hematologic disorder medication review (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('473231009', 'Renal disorder medication review (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('47758006', 'Hepatitis B surface antigen measurement (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('51116004', 'Passive immunization (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('52052004', 'Rehabilitation therapy (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('52765003', 'Intubation (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('57617002', 'Urine specimen collection (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('58000006', 'Patient discharge (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('5880005', 'Physical examination procedure (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('61746007', 'Taking patient vital signs (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('63332003', 'History AND physical examination (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('64544008', 'Gingivectomy or gingivoplasty  per tooth (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('65200003', 'Insertion of intrauterine contraceptive device (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('65546002', 'Extraction of wisdom tooth (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('65575008', 'Biopsy of prostate (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('65677008', 'Pulmonary catheterization with Swan-Ganz catheter (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('66348005', 'Childbirth');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('67879005', 'History and physical examination  limited (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('68071007', 'Dental fluoride treatment (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('69031006', 'Excision of breast tissue (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('69212005', 'Range of motion testing (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('698314001', 'Consultation for treatment (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('698560000', 'Referral to sleep apnea clinic (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('699253003', 'Surgical manipulation of joint of knee (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('70536003', 'Transplant of kidney (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('709138001', 'Notification of treatment plan (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('710824005', 'Assessment of health and social care needs (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('710841007', 'Assessment of anxiety (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('711069006', 'Coordination of care plan (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('711446003', 'Transplantation of kidney regime (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('713021002', 'Plain X-ray of pelvis (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('713024005', 'Plain X-ray of wrist region (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('713026007', 'Plain X-ray of humerus (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('713106006', 'Screening for drug abuse (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('714812005', 'Induced termination of pregnancy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('71493000', 'Transfusion of packed red blood cells (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('715252007', 'Depression screening using Patient Health Questionnaire Nine Item score (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('71651007', 'Mammography (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('736169004', 'Post anesthesia care management (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('73761001', 'Colonoscopy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('76164006', 'Biopsy of colon (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('762993000', 'Assessment using Morse Fall Scale (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('763302001', 'Assessment using Alcohol Use Disorders Identification Test - Consumption (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('76601001', 'Intramuscular injection (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('79345008', 'Excision of maxillary torus palatinus (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('80146002', 'Excision of appendix (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('81733005', 'Dental surgical procedure (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('82808001', 'Sleep apnea monitoring with alarm (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('84100007', 'History taking (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('84478008', 'Occupational therapy (regime/therapy)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('85548006', 'Episiotomy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('866148006', 'Screening for domestic abuse (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('868187001', 'Assessment using Car  Relax  Alone  Forget  Friends  Trouble Screening Test (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('90226004', 'Cytopathology procedure  preparation of smear  genital source (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('90470006', 'Prostatectomy (procedure)');
INSERT INTO `lab_tests` (`code`, `name`) VALUES ('91251008', 'Physical therapy procedure (regime/therapy)');
COMMIT;

-- ----------------------------
-- Table structure for medical_records
-- ----------------------------
DROP TABLE IF EXISTS `medical_records`;
CREATE TABLE `medical_records` (
  `id` char(36) NOT NULL COMMENT 'UUID',
  `appointment_id` char(36) DEFAULT NULL COMMENT '关联就诊/预约',
  `patient_id` char(36) NOT NULL COMMENT '患者ID',
  `record_date` datetime DEFAULT NULL COMMENT '记录日期',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `subjective_notes` text COMMENT '主观笔记',
  `objective_temperature` float DEFAULT NULL COMMENT '体温',
  `objective_blood_pressure` varchar(16) DEFAULT NULL COMMENT '血压',
  `objective_heart_rate` int DEFAULT NULL COMMENT '心率',
  `objective_height` float DEFAULT NULL COMMENT '身高',
  `objective_weight` float DEFAULT NULL COMMENT '体重',
  `objective_other_vitals` text COMMENT '其他生命体征',
  `assessment_diagnosis_code` varchar(32) DEFAULT NULL COMMENT '诊断编码',
  `assessment_diagnosis_desc` varchar(128) DEFAULT NULL COMMENT '诊断描述',
  `assessment_diagnosis_date` date DEFAULT NULL COMMENT '诊断日期',
  `plan_followup_type` varchar(64) DEFAULT NULL COMMENT '计划跟踪类型',
  `plan_followup_date` date DEFAULT NULL COMMENT '计划跟踪日期',
  `plan_medication_code` varchar(32) DEFAULT NULL COMMENT '药物编码',
  `plan_medication_name` varchar(128) DEFAULT NULL COMMENT '药物名称',
  `plan_dosage_value` varchar(32) DEFAULT NULL COMMENT '剂量',
  `plan_frequency_code` varchar(16) DEFAULT NULL COMMENT '用药频率编码',
  `plan_usage_code` varchar(16) DEFAULT NULL COMMENT '用药方式编码',
  `plan_start_date` date DEFAULT NULL COMMENT '用药开始日期',
  `plan_stop_date` date DEFAULT NULL COMMENT '用药结束日期',
  `plan_lab_test_code` varchar(32) DEFAULT NULL COMMENT '检验项目编码',
  `plan_lab_test_name` varchar(128) DEFAULT NULL COMMENT '检验项目名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='病例记录';

-- ----------------------------
-- Records of medical_records
-- ----------------------------
BEGIN;
INSERT INTO `medical_records` (`id`, `appointment_id`, `patient_id`, `record_date`, `created_at`, `updated_at`, `subjective_notes`, `objective_temperature`, `objective_blood_pressure`, `objective_heart_rate`, `objective_height`, `objective_weight`, `objective_other_vitals`, `assessment_diagnosis_code`, `assessment_diagnosis_desc`, `assessment_diagnosis_date`, `plan_followup_type`, `plan_followup_date`, `plan_medication_code`, `plan_medication_name`, `plan_dosage_value`, `plan_frequency_code`, `plan_usage_code`, `plan_start_date`, `plan_stop_date`, `plan_lab_test_code`, `plan_lab_test_name`) VALUES ('3ecb77a7c079ecec85529dbcd2b730bb', '1912775055415209986', '52e7a0fc4129499085a0d66297c3e4d7', '2025-05-21 18:30:00', '2025-05-21 13:23:53', '2025-05-21 13:23:53', '患者自述最近感到疲劳', 36.8, '120/80', 75, 175.5, 70.2, '呼吸正常', 'C123', '高血压2', '2025-05-21', '复诊', '2025-06-21', 'MED789', '阿司匹林', '50mg', 'DAILY', 'ORAL', '2025-05-22', '2025-06-22', 'LBT456', '血常规');
INSERT INTO `medical_records` (`id`, `appointment_id`, `patient_id`, `record_date`, `created_at`, `updated_at`, `subjective_notes`, `objective_temperature`, `objective_blood_pressure`, `objective_heart_rate`, `objective_height`, `objective_weight`, `objective_other_vitals`, `assessment_diagnosis_code`, `assessment_diagnosis_desc`, `assessment_diagnosis_date`, `plan_followup_type`, `plan_followup_date`, `plan_medication_code`, `plan_medication_name`, `plan_dosage_value`, `plan_frequency_code`, `plan_usage_code`, `plan_start_date`, `plan_stop_date`, `plan_lab_test_code`, `plan_lab_test_name`) VALUES ('6c1beb5f4f9a76f56db1051236f5cac0', '1912775055415209986', 'PAT78901', '2025-05-21 18:30:00', '2025-05-21 12:49:51', '2025-05-21 12:54:41', '患者自述最近感到疲劳2', 36.8, '120/80', 75, 175.5, 70.2, '呼吸正常', 'C123', '高血压1', '2025-05-21', '复诊', '2025-06-21', 'MED789', '阿司匹林', '50mg', 'DAILY', 'ORAL', '2025-05-22', '2025-06-22', 'LBT456', '血常规');
COMMIT;

-- ----------------------------
-- Table structure for medications
-- ----------------------------
DROP TABLE IF EXISTS `medications`;
CREATE TABLE `medications` (
  `code` varchar(32) NOT NULL COMMENT '药物编码',
  `name` varchar(128) NOT NULL COMMENT '药物名称',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='药物表';

-- ----------------------------
-- Records of medications
-- ----------------------------
BEGIN;
INSERT INTO `medications` (`code`, `name`) VALUES ('1', '12');
INSERT INTO `medications` (`code`, `name`) VALUES ('1000126', '1 ML medroxyprogesterone acetate 150 MG/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1014676', 'cetirizine hydrochloride 5 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('1043400', 'Acetaminophen 21.7 MG/ML / Dextromethorphan Hydrobromide 1 MG/ML / doxylamine succinate 0.417 MG/ML Oral Solution');
INSERT INTO `medications` (`code`, `name`) VALUES ('1049221', 'Acetaminophen 325 MG / Oxycodone Hydrochloride 5 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('1049504', 'Abuse-Deterrent 12 HR Oxycodone Hydrochloride 10 MG Extended Release Oral Tablet [Oxycontin]');
INSERT INTO `medications` (`code`, `name`) VALUES ('1049625', 'Acetaminophen 325 MG / Oxycodone Hydrochloride 10 MG Oral Tablet [Percocet]');
INSERT INTO `medications` (`code`, `name`) VALUES ('1049630', 'diphenhydrAMINE Hydrochloride 25 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('106258', 'Hydrocortisone 10 MG/ML Topical Cream');
INSERT INTO `medications` (`code`, `name`) VALUES ('106892', 'insulin isophane  human 70 UNT/ML / insulin  regular  human 30 UNT/ML Injectable Suspension [Humulin]');
INSERT INTO `medications` (`code`, `name`) VALUES ('108515', '1 ML tacrolimus 5 MG/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1091392', 'Methylphenidate Hydrochloride 20 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('1234995', 'Rocuronium bromide 10 MG/ML Injectable Solution');
INSERT INTO `medications` (`code`, `name`) VALUES ('1367439', 'NuvaRing 0.12/0.015 MG per 24HR 21 Day Vaginal System');
INSERT INTO `medications` (`code`, `name`) VALUES ('1534809', '168 HR Ethinyl Estradiol 0.00146 MG/HR / norelgestromin 0.00625 MG/HR Transdermal System');
INSERT INTO `medications` (`code`, `name`) VALUES ('1535362', 'sodium fluoride 0.0272 MG/MG Oral Gel');
INSERT INTO `medications` (`code`, `name`) VALUES ('1601380', 'palbociclib 100 MG Oral Capsule');
INSERT INTO `medications` (`code`, `name`) VALUES ('1605257', 'Liletta 52 MG Intrauterine System');
INSERT INTO `medications` (`code`, `name`) VALUES ('1648755', 'nitrofurantoin  macrocrystals 25 MG / nitrofurantoin  monohydrate 75 MG Oral Capsule');
INSERT INTO `medications` (`code`, `name`) VALUES ('1659131', 'piperacillin 2000 MG / tazobactam 250 MG Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1659263', '1 ML heparin sodium  porcine 5000 UNT/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1664463', '24 HR tacrolimus 1 MG Extended Release Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('1665060', 'cefazolin 2000 MG Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1732186', '100 ML Epirubicin Hydrochloride 2 MG/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1735006', '10 ML Fentanyl 0.05 MG/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1740467', '2 ML Ondansetron 2 MG/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1796676', '25 ML protamine sulfate (USP) 10 MG/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1804799', 'Alteplase 100 MG Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1807510', '150 ML vancomycin 5 MG/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1808217', '100 ML Propofol 10 MG/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1856546', 'Kyleena 19.5 MG Intrauterine System');
INSERT INTO `medications` (`code`, `name`) VALUES ('1860154', 'Abuse-Deterrent 12 HR Oxycodone Hydrochloride 15 MG Extended Release Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('1860480', '1 ML DOCEtaxel 20 MG/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('1860491', '12 HR Hydrocodone Bitartrate 10 MG Extended Release Oral Capsule');
INSERT INTO `medications` (`code`, `name`) VALUES ('1870230', 'NDA020800 0.3 ML Epinephrine 1 MG/ML Auto-Injector');
INSERT INTO `medications` (`code`, `name`) VALUES ('1873983', 'ribociclib 200 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('197319', 'Allopurinol 100 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('197454', 'cephalexin 500 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('197511', 'ciprofloxacin 250 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('197591', 'Diazepam 5 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('198014', 'Naproxen 500 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('198240', 'Tamoxifen 10 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('198335', 'sulfamethoxazole 800 MG / trimethoprim 160 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('198405', 'Ibuprofen 100 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('198440', 'Acetaminophen 500 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('2001499', 'Vitamin B12 5 MG/ML Injectable Solution');
INSERT INTO `medications` (`code`, `name`) VALUES ('200243', 'sevoflurane 1000 MG/ML Inhalation Solution');
INSERT INTO `medications` (`code`, `name`) VALUES ('205923', '1 ML Epoetin Alfa 4000 UNT/ML Injection [Epogen]');
INSERT INTO `medications` (`code`, `name`) VALUES ('206905', 'Ibuprofen 400 MG Oral Tablet [Ibu]');
INSERT INTO `medications` (`code`, `name`) VALUES ('209387', 'Acetaminophen 325 MG Oral Tablet [Tylenol]');
INSERT INTO `medications` (`code`, `name`) VALUES ('2119714', '5 ML hyaluronidase-oysk 2000 UNT/ML / trastuzumab 120 MG/ML Injection');
INSERT INTO `medications` (`code`, `name`) VALUES ('243670', 'aspirin 81 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('245134', '72 HR Fentanyl 0.025 MG/HR Transdermal System');
INSERT INTO `medications` (`code`, `name`) VALUES ('245314', 'albuterol 5 MG/ML Inhalation Solution');
INSERT INTO `medications` (`code`, `name`) VALUES ('308136', 'amLODIPine 2.5 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('308182', 'Amoxicillin 250 MG Oral Capsule');
INSERT INTO `medications` (`code`, `name`) VALUES ('308192', 'Amoxicillin 500 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('308971', 'carbamazepine 20 MG/ML Oral Suspension [Tegretol]');
INSERT INTO `medications` (`code`, `name`) VALUES ('309097', 'Cefuroxime 250 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('309309', 'ciprofloxacin 500 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('309362', 'Clopidogrel 75 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('310261', 'exemestane 25 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('310325', 'ferrous sulfate 325 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('310385', 'FLUoxetine 20 MG Oral Capsule');
INSERT INTO `medications` (`code`, `name`) VALUES ('310798', 'Hydrochlorothiazide 25 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('310965', 'Ibuprofen 200 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('311372', 'Loratadine 10 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('311700', 'Midazolam 1 MG/ML Injectable Solution');
INSERT INTO `medications` (`code`, `name`) VALUES ('312617', 'predniSONE 5 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('312961', 'Simvastatin 20 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('313782', 'Acetaminophen 325 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('313820', 'Acetaminophen 160 MG Chewable Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('314076', 'lisinopril 10 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('314231', 'simvastatin 10 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('351109', 'budesonide 0.25 MG/ML Inhalation Suspension');
INSERT INTO `medications` (`code`, `name`) VALUES ('351137', 'albuterol 0.21 MG/ML Inhalation Solution');
INSERT INTO `medications` (`code`, `name`) VALUES ('389221', 'Etonogestrel 68 MG Drug Implant');
INSERT INTO `medications` (`code`, `name`) VALUES ('477045', 'Chlorpheniramine Maleate 2 MG/ML Oral Solution');
INSERT INTO `medications` (`code`, `name`) VALUES ('483438', 'pregabalin 100 MG Oral Capsule');
INSERT INTO `medications` (`code`, `name`) VALUES ('562251', 'Amoxicillin 250 MG / Clavulanate 125 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('562508', 'amoxicillin 875 MG / clavulanate 125 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('596926', 'duloxetine 20 MG Delayed Release Oral Capsule');
INSERT INTO `medications` (`code`, `name`) VALUES ('616830', 'budesonide 0.125 MG/ML Inhalation Suspension [Pulmicort]');
INSERT INTO `medications` (`code`, `name`) VALUES ('617296', 'amoxicillin 500 MG / clavulanate 125 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('665078', 'Loratadine 5 MG Chewable Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('705129', 'Nitroglycerin 0.4 MG/ACTUAT Mucosal Spray');
INSERT INTO `medications` (`code`, `name`) VALUES ('745752', 'NDA021457 200 ACTUAT albuterol 0.09 MG/ACTUAT Metered Dose Inhaler [ProAir]');
INSERT INTO `medications` (`code`, `name`) VALUES ('748856', 'Yaz 28 Day Pack');
INSERT INTO `medications` (`code`, `name`) VALUES ('748879', 'Levora 0.15/30 28 Day Pack');
INSERT INTO `medications` (`code`, `name`) VALUES ('748962', 'Camila 28 Day Pack');
INSERT INTO `medications` (`code`, `name`) VALUES ('749762', 'Seasonique 91 Day Pack');
INSERT INTO `medications` (`code`, `name`) VALUES ('751905', 'Trinessa 28 Day Pack');
INSERT INTO `medications` (`code`, `name`) VALUES ('752899', '0.25 ML Leuprolide Acetate 30 MG/ML Prefilled Syringe');
INSERT INTO `medications` (`code`, `name`) VALUES ('757594', 'Jolivette 28 Day Pack');
INSERT INTO `medications` (`code`, `name`) VALUES ('789980', 'Ampicillin 100 MG/ML Injectable Solution');
INSERT INTO `medications` (`code`, `name`) VALUES ('807283', 'Mirena 52 MG Intrauterine System');
INSERT INTO `medications` (`code`, `name`) VALUES ('831533', 'Errin 28 Day Pack');
INSERT INTO `medications` (`code`, `name`) VALUES ('833135', 'Milnacipran hydrochloride 100 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('834061', 'Penicillin V Potassium 250 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('834102', 'Penicillin V Potassium 500 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('835603', 'tramadol hydrochloride 50 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('849574', 'Naproxen sodium 220 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('854235', '0.4 ML Enoxaparin sodium 100 MG/ML Prefilled Syringe');
INSERT INTO `medications` (`code`, `name`) VALUES ('856987', 'Acetaminophen 300 MG / Hydrocodone Bitartrate 5 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('857005', 'Acetaminophen 325 MG / HYDROcodone Bitartrate 7.5 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('859088', 'NDA020983 200 ACTUAT albuterol 0.09 MG/ACTUAT Metered Dose Inhaler [Ventolin]');
INSERT INTO `medications` (`code`, `name`) VALUES ('860975', '24 HR Metformin hydrochloride 500 MG Extended Release Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('861467', 'Meperidine Hydrochloride 50 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('866412', '24 HR metoprolol succinate 100 MG Extended Release Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('866924', 'metoprolol tartrate 25 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('895996', '120 ACTUAT fluticasone propionate 0.044 MG/ACTUAT Metered Dose Inhaler [Flovent]');
INSERT INTO `medications` (`code`, `name`) VALUES ('896001', '120 ACTUAT fluticasone propionate 0.11 MG/ACTUAT Metered Dose Inhaler [Flovent]');
INSERT INTO `medications` (`code`, `name`) VALUES ('896209', '60 ACTUAT Fluticasone propionate 0.25 MG/ACTUAT / salmeterol 0.05 MG/ACTUAT Dry Powder Inhaler');
INSERT INTO `medications` (`code`, `name`) VALUES ('904419', 'Alendronic acid 10 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('978950', 'Natazia 28 Day Pack');
INSERT INTO `medications` (`code`, `name`) VALUES ('993770', 'Acetaminophen 300 MG / Codeine Phosphate 15 MG Oral Tablet');
INSERT INTO `medications` (`code`, `name`) VALUES ('997488', 'Fexofenadine hydrochloride 30 MG Oral Tablet');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
