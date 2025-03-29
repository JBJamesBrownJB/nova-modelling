// Mock data based on healthcare model example from create_model_EXAMPLE.cypher
const mockData = {
  nodes: [
    // JTBD Nodes
    { id: 'jtbd1', label: 'JTBD', name: 'Diagnose Patient', progress: 0, complexity: 72 },
    { id: 'jtbd2', label: 'JTBD', name: 'Re-diagnose patient', progress: 0, complexity: 58 },
    { id: 'jtbd3', label: 'JTBD', name: 'Find Patient', progress: 0, complexity: 45 },
    { id: 'jtbd4', label: 'JTBD', name: 'Prescribe treatment', progress: 0, complexity: 62 },
    { id: 'jtbd5', label: 'JTBD', name: 'Assign bed', progress: 0, complexity: 38 },
    { id: 'jtbd6', label: 'JTBD', name: 'Choose Meal', progress: 0, complexity: 52 },
    { id: 'jtbd7', label: 'JTBD', name: 'Discharge Patient', progress: 0, complexity: 65 },
    { id: 'jtbd8', label: 'JTBD', name: 'Treat Patient', progress: 0, complexity: 78 },
    { id: 'jtbd9', label: 'JTBD', name: 'Monitor Patient', progress: 0, complexity: 95 },
    { id: 'jtbd10', label: 'JTBD', name: 'Assign shift', progress: 0, complexity: 48 },
    { id: 'jtbd11', label: 'JTBD', name: 'View on duty staff', progress: 0, complexity: 37 },
    { id: 'jtbd12', label: 'JTBD', name: 'Contact on duty doctor', progress: 0, complexity: 42 },
    { id: 'jtbd13', label: 'JTBD', name: 'Request clean up', progress: 0, complexity: 40 },
    { id: 'jtbd14', label: 'JTBD', name: 'Pay Invoice', progress: 0, complexity: 50 },
    
    // New JTBD nodes (healthcare related)
    { id: 'jtbd15', label: 'JTBD', name: 'Schedule Appointment', progress: 0, complexity: 55 },
    { id: 'jtbd16', label: 'JTBD', name: 'Order Medication', progress: 0, complexity: 68 },
    { id: 'jtbd17', label: 'JTBD', name: 'Perform Lab Test', progress: 0, complexity: 75 },
    { id: 'jtbd18', label: 'JTBD', name: 'Review Lab Results', progress: 0, complexity: 60 },
    { id: 'jtbd19', label: 'JTBD', name: 'Manage Patient Records', progress: 0, complexity: 82 },
    { id: 'jtbd20', label: 'JTBD', name: 'Triage Emergency', progress: 0, complexity: 88 },
    { id: 'jtbd21', label: 'JTBD', name: 'Transfer Patient', progress: 0, complexity: 70 },
    { id: 'jtbd22', label: 'JTBD', name: 'Check In Patient', progress: 0, complexity: 45 },
    { id: 'jtbd23', label: 'JTBD', name: 'Provide Visitor Pass', progress: 0, complexity: 35 },
    { id: 'jtbd24', label: 'JTBD', name: 'Conduct Rounds', progress: 0, complexity: 58 },
    { id: 'jtbd25', label: 'JTBD', name: 'Administer Medication', progress: 0, complexity: 65 },
    { id: 'jtbd26', label: 'JTBD', name: 'Process Insurance', progress: 0, complexity: 78 },
    { id: 'jtbd27', label: 'JTBD', name: 'Handle Incident Report', progress: 0, complexity: 62 },
    { id: 'jtbd28', label: 'JTBD', name: 'Manage Allergies', progress: 0, complexity: 56 },
    { id: 'jtbd29', label: 'JTBD', name: 'Update Medical History', progress: 0, complexity: 72 },
    { id: 'jtbd30', label: 'JTBD', name: 'Process Referral', progress: 0, complexity: 54 },
    { id: 'jtbd31', label: 'JTBD', name: 'Sanitize Equipment', progress: 0, complexity: 48 },
    { id: 'jtbd32', label: 'JTBD', name: 'Create Care Plan', progress: 0, complexity: 85 },
    { id: 'jtbd33', label: 'JTBD', name: 'Document Patient Encounter', progress: 0, complexity: 64 },
    { id: 'jtbd34', label: 'JTBD', name: 'Coordinate Follow-up', progress: 0, complexity: 52 },
    
    // User Nodes
    { id: 'user1', label: 'User', name: 'Doctor' },
    { id: 'user2', label: 'User', name: 'Nurse' },
    { id: 'user3', label: 'User', name: 'Admin' },
    { id: 'user4', label: 'User', name: 'Patient' },
    { id: 'user5', label: 'User', name: 'Security Guard' },
    { id: 'user6', label: 'User', name: 'Family Member' },
    { id: 'user7', label: 'User', name: 'Police' },
    { id: 'user8', label: 'User', name: 'Porter' },
    { id: 'user9', label: 'User', name: 'Staff' },
    
    // Service Nodes (previously Data Nodes)
    { id: 'service1', label: 'Service', name: 'Patient Management', consumers: 4 },
    { id: 'service2', label: 'Service', name: 'Disease Reference', consumers: 2 },
    { id: 'service3', label: 'Service', name: 'Patient Profile', consumers: 5 },
    { id: 'service4', label: 'Service', name: 'Diagnosis System', consumers: 6 },
    { id: 'service5', label: 'Service', name: 'Electronic Health Records', consumers: 4 },
    { id: 'service6', label: 'Service', name: 'Treatment Catalog', consumers: 3 },
    { id: 'service7', label: 'Service', name: 'Facility Management', consumers: 5 },
    { id: 'service8', label: 'Service', name: 'Bed Management', consumers: 3 },
    { id: 'service9', label: 'Service', name: 'Nutrition Management', consumers: 1 },
    { id: 'service10', label: 'Service', name: 'Allergen Repository', consumers: 1 },
    { id: 'service11', label: 'Service', name: 'Meal Ordering', consumers: 1 },
    { id: 'service12', label: 'Service', name: 'Pharmacy System', consumers: 2 },
    { id: 'service13', label: 'Service', name: 'Equipment Management', consumers: 3 },
    { id: 'service14', label: 'Service', name: 'Vital Signs Monitoring', consumers: 1 },
    { id: 'service15', label: 'Service', name: 'Blood Pressure Monitoring', consumers: 1 },
    { id: 'service16', label: 'Service', name: 'Temperature Monitoring', consumers: 1 },
    { id: 'service17', label: 'Service', name: 'Visual Monitoring', consumers: 1 },
    { id: 'service18', label: 'Service', name: 'Alert System', consumers: 1 },
    { id: 'service19', label: 'Service', name: 'Staff Scheduling', consumers: 4 },
    { id: 'service20', label: 'Service', name: 'Notification System', consumers: 2 },
    { id: 'service21', label: 'Service', name: 'Shift Management', consumers: 2 },
    { id: 'service22', label: 'Service', name: 'Calendar System', consumers: 5 },
    { id: 'service23', label: 'Service', name: 'Staff Directory', consumers: 4 },
    { id: 'service24', label: 'Service', name: 'Housekeeping Services', consumers: 2 },
    { id: 'service25', label: 'Service', name: 'Billing System', consumers: 2 },
  ],
  links: [
    // Doctor relationships
    { id: 'rel1', source: 'user1', target: 'jtbd1', type: 'DOES' },
    { id: 'rel2', source: 'user1', target: 'jtbd2', type: 'DOES' },
    { id: 'rel3', source: 'user1', target: 'jtbd3', type: 'DOES' },
    { id: 'rel4', source: 'user1', target: 'jtbd4', type: 'DOES' },
    { id: 'rel5', source: 'user1', target: 'jtbd5', type: 'DOES' },
    { id: 'rel6', source: 'user1', target: 'jtbd7', type: 'DOES' },
    { id: 'rel7', source: 'user1', target: 'jtbd8', type: 'DOES' },
    { id: 'rel8', source: 'user1', target: 'jtbd9', type: 'DOES' },
    { id: 'rel9', source: 'user1', target: 'jtbd10', type: 'DOES' },
    { id: 'rel10', source: 'user1', target: 'jtbd11', type: 'DOES' },
    { id: 'rel11', source: 'user1', target: 'jtbd13', type: 'DOES' },
    
    // Nurse relationships
    { id: 'rel12', source: 'user2', target: 'jtbd3', type: 'DOES' },
    { id: 'rel13', source: 'user2', target: 'jtbd5', type: 'DOES' },
    { id: 'rel14', source: 'user2', target: 'jtbd7', type: 'DOES' },
    { id: 'rel15', source: 'user2', target: 'jtbd8', type: 'DOES' },
    { id: 'rel16', source: 'user2', target: 'jtbd9', type: 'DOES' },
    { id: 'rel17', source: 'user2', target: 'jtbd10', type: 'DOES' },
    { id: 'rel18', source: 'user2', target: 'jtbd11', type: 'DOES' },
    { id: 'rel19', source: 'user2', target: 'jtbd13', type: 'DOES' },
    
    // Patient relationships
    { id: 'rel20', source: 'user4', target: 'jtbd6', type: 'DOES' },
    { id: 'rel21', source: 'user4', target: 'jtbd7', type: 'DOES' },
    
    // Add missing relationships for Contact on duty doctor
    { id: 'rel53', source: 'user2', target: 'jtbd12', type: 'DOES' }, 
    { id: 'rel54', source: 'jtbd12', target: 'service19', type: 'DEPENDS_ON' }, 
    { id: 'rel55', source: 'jtbd12', target: 'service23', type: 'DEPENDS_ON' }, 
    
    // Add missing relationships for Pay Invoice
    { id: 'rel56', source: 'user4', target: 'jtbd14', type: 'DOES' }, 
    { id: 'rel57', source: 'user3', target: 'jtbd14', type: 'DOES' }, 
    { id: 'rel58', source: 'jtbd14', target: 'service25', type: 'DEPENDS_ON' }, 
    
    // Connect Security Guard
    { id: 'rel60', source: 'user5', target: 'jtbd23', type: 'DOES' }, 
    
    // Connect Family Member
    { id: 'rel61', source: 'user6', target: 'jtbd23', type: 'DOES' }, 
    
    // Connect Police
    { id: 'rel62', source: 'user7', target: 'jtbd27', type: 'DOES' }, 
    
    // Connect Porter
    { id: 'rel63', source: 'user8', target: 'jtbd21', type: 'DOES' }, 
    
    // Connect Staff with unassigned JTBDs
    { id: 'rel64', source: 'user9', target: 'jtbd13', type: 'DOES' }, 
    { id: 'rel65', source: 'user9', target: 'jtbd22', type: 'DOES' }, 
    
    // Service dependencies for Find Patient
    { id: 'rel66', source: 'jtbd3', target: 'service1', type: 'DEPENDS_ON' },
    { id: 'rel67', source: 'jtbd3', target: 'service3', type: 'DEPENDS_ON' },
    
    // Service dependencies for Prescribe treatment
    { id: 'rel68', source: 'jtbd4', target: 'service4', type: 'DEPENDS_ON' },
    { id: 'rel69', source: 'jtbd4', target: 'service6', type: 'DEPENDS_ON' },
    { id: 'rel70', source: 'jtbd4', target: 'service12', type: 'DEPENDS_ON' },
    { id: 'rel71', source: 'jtbd4', target: 'service5', type: 'DEPENDS_ON' },
    
    // Service dependencies for Assign bed
    { id: 'rel72', source: 'jtbd5', target: 'service8', type: 'DEPENDS_ON' },
    
    // Service dependencies for Choose Meal
    { id: 'rel74', source: 'jtbd6', target: 'service9', type: 'DEPENDS_ON' },
    { id: 'rel75', source: 'jtbd6', target: 'service10', type: 'DEPENDS_ON' },
    { id: 'rel76', source: 'jtbd6', target: 'service11', type: 'DEPENDS_ON' },
    
    // Service dependencies for Discharge Patient
    { id: 'rel77', source: 'jtbd7', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel78', source: 'jtbd7', target: 'service4', type: 'DEPENDS_ON' },
    { id: 'rel79', source: 'jtbd7', target: 'service25', type: 'DEPENDS_ON' },
    
    // Service dependencies for Diagnose Patient
    { id: 'rel22', source: 'jtbd1', target: 'service1', type: 'DEPENDS_ON' },
    { id: 'rel23', source: 'jtbd1', target: 'service2', type: 'DEPENDS_ON' },
    { id: 'rel24', source: 'jtbd1', target: 'service3', type: 'DEPENDS_ON' },
    { id: 'rel25', source: 'jtbd1', target: 'service4', type: 'DEPENDS_ON' },
    { id: 'rel26', source: 'jtbd1', target: 'service5', type: 'DEPENDS_ON' },
    
    // DEPENDS_ON relationships for Re-diagnose patient
    { id: 'rel27', source: 'jtbd2', target: 'service1', type: 'DEPENDS_ON' },
    { id: 'rel28', source: 'jtbd2', target: 'service2', type: 'DEPENDS_ON' },
    { id: 'rel29', source: 'jtbd2', target: 'service3', type: 'DEPENDS_ON' },
    { id: 'rel30', source: 'jtbd2', target: 'service4', type: 'DEPENDS_ON' },
    { id: 'rel31', source: 'jtbd2', target: 'service5', type: 'DEPENDS_ON' },
    
    // Service dependencies for Treat Patient
    { id: 'rel32', source: 'jtbd8', target: 'service4', type: 'DEPENDS_ON' },
    { id: 'rel33', source: 'jtbd8', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel34', source: 'jtbd8', target: 'service6', type: 'DEPENDS_ON' },
    { id: 'rel35', source: 'jtbd8', target: 'service12', type: 'DEPENDS_ON' },
    { id: 'rel36', source: 'jtbd8', target: 'service13', type: 'DEPENDS_ON' },
    
    // Service dependencies for Monitor Patient
    { id: 'rel37', source: 'jtbd9', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel38', source: 'jtbd9', target: 'service14', type: 'DEPENDS_ON' },
    { id: 'rel39', source: 'jtbd9', target: 'service15', type: 'DEPENDS_ON' },
    { id: 'rel40', source: 'jtbd9', target: 'service16', type: 'DEPENDS_ON' },
    { id: 'rel41', source: 'jtbd9', target: 'service17', type: 'DEPENDS_ON' },
    { id: 'rel42', source: 'jtbd9', target: 'service18', type: 'DEPENDS_ON' },
    
    // Service dependencies for Assign shift
    { id: 'rel43', source: 'jtbd10', target: 'service19', type: 'DEPENDS_ON' },
    { id: 'rel44', source: 'jtbd10', target: 'service21', type: 'DEPENDS_ON' },
    { id: 'rel45', source: 'jtbd10', target: 'service22', type: 'DEPENDS_ON' },
    { id: 'rel46', source: 'jtbd10', target: 'service23', type: 'DEPENDS_ON' },
    
    // Service dependencies for View on duty staff
    { id: 'rel47', source: 'jtbd11', target: 'service19', type: 'DEPENDS_ON' },
    { id: 'rel48', source: 'jtbd11', target: 'service21', type: 'DEPENDS_ON' },
    { id: 'rel49', source: 'jtbd11', target: 'service23', type: 'DEPENDS_ON' },
    
    // Service dependencies for Request clean up
    { id: 'rel50', source: 'jtbd13', target: 'service7', type: 'DEPENDS_ON' },
    { id: 'rel51', source: 'jtbd13', target: 'service24', type: 'DEPENDS_ON' },
    
    // Add dependencies for additional JTBDs
    { id: 'rel80', source: 'jtbd15', target: 'service22', type: 'DEPENDS_ON' },
    { id: 'rel81', source: 'jtbd15', target: 'service19', type: 'DEPENDS_ON' },
    { id: 'rel82', source: 'jtbd15', target: 'service1', type: 'DEPENDS_ON' },
    
    { id: 'rel83', source: 'jtbd16', target: 'service12', type: 'DEPENDS_ON' },
    { id: 'rel84', source: 'jtbd16', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel85', source: 'jtbd17', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel86', source: 'jtbd18', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel87', source: 'jtbd19', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel88', source: 'jtbd19', target: 'service1', type: 'DEPENDS_ON' },
    { id: 'rel89', source: 'jtbd19', target: 'service3', type: 'DEPENDS_ON' },
    
    { id: 'rel90', source: 'jtbd20', target: 'service18', type: 'DEPENDS_ON' },
    { id: 'rel91', source: 'jtbd20', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel92', source: 'jtbd21', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel93', source: 'jtbd21', target: 'service7', type: 'DEPENDS_ON' },
    { id: 'rel94', source: 'jtbd21', target: 'service8', type: 'DEPENDS_ON' },
    
    { id: 'rel95', source: 'jtbd22', target: 'service1', type: 'DEPENDS_ON' },
    { id: 'rel96', source: 'jtbd22', target: 'service3', type: 'DEPENDS_ON' },
    
    { id: 'rel97', source: 'jtbd23', target: 'service7', type: 'DEPENDS_ON' },
    
    { id: 'rel98', source: 'jtbd24', target: 'service8', type: 'DEPENDS_ON' },
    { id: 'rel99', source: 'jtbd24', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel100', source: 'jtbd25', target: 'service12', type: 'DEPENDS_ON' },
    { id: 'rel101', source: 'jtbd25', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel102', source: 'jtbd26', target: 'service25', type: 'DEPENDS_ON' },
    { id: 'rel103', source: 'jtbd26', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel104', source: 'jtbd27', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel105', source: 'jtbd27', target: 'service20', type: 'DEPENDS_ON' },
    
    { id: 'rel106', source: 'jtbd28', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel107', source: 'jtbd28', target: 'service10', type: 'DEPENDS_ON' },
  ]
};

export default mockData;
