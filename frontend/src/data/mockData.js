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
    
    // Data Nodes
    { id: 'data1', label: 'Data', name: 'Patient List', readers: 4 },
    { id: 'data2', label: 'Data', name: 'Diseases', readers: 2 },
    { id: 'data3', label: 'Data', name: 'Patient Details', readers: 5 },
    { id: 'data4', label: 'Data', name: 'Diagnosis', readers: 6 },
    { id: 'data5', label: 'Data', name: 'Patient Record', readers: 4 },
    { id: 'data6', label: 'Data', name: 'Treatments', readers: 3 },
    { id: 'data7', label: 'Data', name: 'Facilitites', readers: 5 },
    { id: 'data8', label: 'Data', name: 'Beds', readers: 3 },
    { id: 'data9', label: 'Data', name: 'Menu', readers: 1 },
    { id: 'data10', label: 'Data', name: 'Allergens', readers: 1 },
    { id: 'data11', label: 'Data', name: 'Meal Order', readers: 1 },
    { id: 'data12', label: 'Data', name: 'Medicine', readers: 2 },
    { id: 'data13', label: 'Data', name: 'Equipment', readers: 3 },
    { id: 'data14', label: 'Data', name: 'Heartbeat', readers: 1 },
    { id: 'data15', label: 'Data', name: 'Blood Preassure', readers: 1 },
    { id: 'data16', label: 'Data', name: 'Patient Temperature', readers: 1 },
    { id: 'data17', label: 'Data', name: 'Patient Visuals', readers: 1 },
    { id: 'data18', label: 'Data', name: 'Assistance Alarm', readers: 1 },
    { id: 'data19', label: 'Data', name: 'Staff Schedule', readers: 4 },
    { id: 'data20', label: 'Data', name: 'Alerts', readers: 2 },
    { id: 'data21', label: 'Data', name: 'Shifts', readers: 2 },
    { id: 'data22', label: 'Data', name: 'Schedule', readers: 5 },
    { id: 'data23', label: 'Data', name: 'Staff', readers: 4 },
    { id: 'data24', label: 'Data', name: 'Cleaning Task', readers: 2 },
    { id: 'data25', label: 'Data', name: 'Invoice', readers: 2 },
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
    { id: 'rel54', source: 'jtbd12', target: 'data19', type: 'READS' }, 
    { id: 'rel55', source: 'jtbd12', target: 'data23', type: 'READS' }, 
    
    // Add missing relationships for Pay Invoice
    { id: 'rel56', source: 'user4', target: 'jtbd14', type: 'DOES' }, 
    { id: 'rel57', source: 'user3', target: 'jtbd14', type: 'DOES' }, 
    { id: 'rel58', source: 'jtbd14', target: 'data25', type: 'READS' }, 
    { id: 'rel59', source: 'jtbd14', target: 'data25', type: 'UPDATES' }, 
    
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
    
    // Additional data connections for Find Patient
    { id: 'rel66', source: 'jtbd3', target: 'data1', type: 'READS' },
    { id: 'rel67', source: 'jtbd3', target: 'data3', type: 'READS' },
    
    // Data connections for Prescribe treatment
    { id: 'rel68', source: 'jtbd4', target: 'data4', type: 'READS' },
    { id: 'rel69', source: 'jtbd4', target: 'data6', type: 'READS' },
    { id: 'rel70', source: 'jtbd4', target: 'data12', type: 'READS' },
    { id: 'rel71', source: 'jtbd4', target: 'data5', type: 'UPDATES' },
    
    // Data connections for Assign bed
    { id: 'rel72', source: 'jtbd5', target: 'data8', type: 'READS' },
    { id: 'rel73', source: 'jtbd5', target: 'data8', type: 'UPDATES' },
    
    // Data connections for Choose Meal
    { id: 'rel74', source: 'jtbd6', target: 'data9', type: 'READS' },
    { id: 'rel75', source: 'jtbd6', target: 'data10', type: 'READS' },
    { id: 'rel76', source: 'jtbd6', target: 'data11', type: 'WRITES' },
    
    // Data connections for Discharge Patient
    { id: 'rel77', source: 'jtbd7', target: 'data5', type: 'READS' },
    { id: 'rel78', source: 'jtbd7', target: 'data4', type: 'READS' },
    { id: 'rel79', source: 'jtbd7', target: 'data25', type: 'WRITES' },
    { id: 'rel80', source: 'jtbd7', target: 'data5', type: 'UPDATES' },
    
    // Data relationships for Diagnose Patient
    { id: 'rel22', source: 'jtbd1', target: 'data1', type: 'READS' },
    { id: 'rel23', source: 'jtbd1', target: 'data2', type: 'READS' },
    { id: 'rel24', source: 'jtbd1', target: 'data3', type: 'READS' },
    { id: 'rel25', source: 'jtbd1', target: 'data4', type: 'READS' },
    { id: 'rel26', source: 'jtbd1', target: 'data1', type: 'WRITES' },
    { id: 'rel27', source: 'jtbd1', target: 'data1', type: 'UPDATES' },
    
    // Data relationships for Re-diagnose patient
    { id: 'rel28', source: 'jtbd2', target: 'data1', type: 'READS' },
    { id: 'rel29', source: 'jtbd2', target: 'data2', type: 'READS' },
    { id: 'rel30', source: 'jtbd2', target: 'data3', type: 'READS' },
    { id: 'rel31', source: 'jtbd2', target: 'data4', type: 'READS' },
    { id: 'rel32', source: 'jtbd2', target: 'data1', type: 'UPDATES' },
    
    // Additional sample relationships (not comprehensive)
    { id: 'rel33', source: 'jtbd8', target: 'data4', type: 'READS' },
    { id: 'rel34', source: 'jtbd8', target: 'data5', type: 'READS' },
    { id: 'rel35', source: 'jtbd8', target: 'data6', type: 'READS' },
    { id: 'rel36', source: 'jtbd8', target: 'data12', type: 'READS' },
    { id: 'rel37', source: 'jtbd8', target: 'data13', type: 'READS' },
    { id: 'rel38', source: 'jtbd8', target: 'data4', type: 'WRITES' },
    { id: 'rel39', source: 'jtbd8', target: 'data4', type: 'UPDATES' },
    { id: 'rel40', source: 'jtbd8', target: 'data5', type: 'UPDATES' },
    
    // Monitor Patient relationships
    { id: 'rel41', source: 'jtbd9', target: 'data4', type: 'READS' },
    { id: 'rel42', source: 'jtbd9', target: 'data5', type: 'READS' },
    { id: 'rel43', source: 'jtbd9', target: 'data7', type: 'READS' },
    { id: 'rel44', source: 'jtbd9', target: 'data13', type: 'READS' },
    { id: 'rel45', source: 'jtbd9', target: 'data14', type: 'READS' },
    { id: 'rel46', source: 'jtbd9', target: 'data15', type: 'READS' },
    { id: 'rel47', source: 'jtbd9', target: 'data16', type: 'READS' },
    { id: 'rel48', source: 'jtbd9', target: 'data17', type: 'READS' },
    { id: 'rel49', source: 'jtbd9', target: 'data18', type: 'READS' },
    { id: 'rel50', source: 'jtbd9', target: 'data19', type: 'READS' },
    { id: 'rel51', source: 'jtbd9', target: 'data4', type: 'WRITES' },
    { id: 'rel52', source: 'jtbd9', target: 'data4', type: 'UPDATES' },
    
    // Assign shift relationships
    { id: 'rel81', source: 'jtbd10', target: 'data19', type: 'READS' },
    { id: 'rel82', source: 'jtbd10', target: 'data21', type: 'READS' },
    { id: 'rel83', source: 'jtbd10', target: 'data22', type: 'READS' },
    { id: 'rel84', source: 'jtbd10', target: 'data19', type: 'UPDATES' },
    { id: 'rel85', source: 'jtbd10', target: 'data21', type: 'UPDATES' },
    
    // View on duty staff relationships
    { id: 'rel86', source: 'jtbd11', target: 'data19', type: 'READS' },
    { id: 'rel87', source: 'jtbd11', target: 'data21', type: 'READS' },
    { id: 'rel88', source: 'jtbd11', target: 'data23', type: 'READS' },
    
    // Request clean up relationships
    { id: 'rel89', source: 'jtbd13', target: 'data7', type: 'READS' },
    { id: 'rel90', source: 'jtbd13', target: 'data24', type: 'WRITES' },
    
    // Schedule Appointment relationships
    { id: 'rel91', source: 'user3', target: 'jtbd15', type: 'DOES' }, 
    { id: 'rel92', source: 'user4', target: 'jtbd15', type: 'DOES' }, 
    { id: 'rel93', source: 'jtbd15', target: 'data1', type: 'READS' },
    { id: 'rel94', source: 'jtbd15', target: 'data22', type: 'READS' },
    { id: 'rel95', source: 'jtbd15', target: 'data19', type: 'READS' },
    { id: 'rel96', source: 'jtbd15', target: 'data22', type: 'WRITES' },
    { id: 'rel97', source: 'jtbd15', target: 'data22', type: 'UPDATES' },
    
    // Order Medication relationships
    { id: 'rel98', source: 'user1', target: 'jtbd16', type: 'DOES' }, 
    { id: 'rel99', source: 'user2', target: 'jtbd16', type: 'DOES' }, 
    { id: 'rel100', source: 'jtbd16', target: 'data12', type: 'READS' },
    { id: 'rel101', source: 'jtbd16', target: 'data5', type: 'READS' },
    { id: 'rel102', source: 'jtbd16', target: 'data12', type: 'UPDATES' },
    { id: 'rel103', source: 'jtbd16', target: 'data5', type: 'UPDATES' },
    
    // Perform Lab Test relationships
    { id: 'rel104', source: 'user2', target: 'jtbd17', type: 'DOES' }, 
    { id: 'rel105', source: 'user9', target: 'jtbd17', type: 'DOES' }, 
    { id: 'rel106', source: 'jtbd17', target: 'data3', type: 'READS' },
    { id: 'rel107', source: 'jtbd17', target: 'data5', type: 'READS' },
    { id: 'rel108', source: 'jtbd17', target: 'data13', type: 'READS' },
    { id: 'rel109', source: 'jtbd17', target: 'data5', type: 'WRITES' },
    { id: 'rel110', source: 'jtbd17', target: 'data5', type: 'UPDATES' },
    
    // Review Lab Results relationships
    { id: 'rel111', source: 'user1', target: 'jtbd18', type: 'DOES' }, 
    { id: 'rel112', source: 'jtbd18', target: 'data5', type: 'READS' },
    { id: 'rel113', source: 'jtbd18', target: 'data4', type: 'READS' },
    { id: 'rel114', source: 'jtbd18', target: 'data4', type: 'UPDATES' },
    { id: 'rel115', source: 'jtbd18', target: 'data5', type: 'UPDATES' },
    
    // Manage Patient Records relationships
    { id: 'rel116', source: 'user1', target: 'jtbd19', type: 'DOES' }, 
    { id: 'rel117', source: 'user2', target: 'jtbd19', type: 'DOES' }, 
    { id: 'rel118', source: 'user3', target: 'jtbd19', type: 'DOES' }, 
    { id: 'rel119', source: 'jtbd19', target: 'data1', type: 'READS' },
    { id: 'rel120', source: 'jtbd19', target: 'data3', type: 'READS' },
    { id: 'rel121', source: 'jtbd19', target: 'data4', type: 'READS' },
    { id: 'rel122', source: 'jtbd19', target: 'data5', type: 'READS' },
    { id: 'rel123', source: 'jtbd19', target: 'data1', type: 'WRITES' },
    { id: 'rel124', source: 'jtbd19', target: 'data3', type: 'WRITES' },
    { id: 'rel125', source: 'jtbd19', target: 'data5', type: 'WRITES' },
    { id: 'rel126', source: 'jtbd19', target: 'data1', type: 'UPDATES' },
    { id: 'rel127', source: 'jtbd19', target: 'data3', type: 'UPDATES' },
    { id: 'rel128', source: 'jtbd19', target: 'data5', type: 'UPDATES' },
    
    // Triage Emergency relationships
    { id: 'rel129', source: 'user1', target: 'jtbd20', type: 'DOES' }, 
    { id: 'rel130', source: 'user2', target: 'jtbd20', type: 'DOES' }, 
    { id: 'rel131', source: 'jtbd20', target: 'data1', type: 'READS' },
    { id: 'rel132', source: 'jtbd20', target: 'data2', type: 'READS' },
    { id: 'rel133', source: 'jtbd20', target: 'data3', type: 'READS' },
    { id: 'rel134', source: 'jtbd20', target: 'data13', type: 'READS' },
    { id: 'rel135', source: 'jtbd20', target: 'data1', type: 'WRITES' },
    { id: 'rel136', source: 'jtbd20', target: 'data4', type: 'WRITES' },
    { id: 'rel137', source: 'jtbd20', target: 'data20', type: 'WRITES' },
    
    // Transfer Patient relationships
    { id: 'rel138', source: 'user8', target: 'jtbd21', type: 'DOES' }, 
    { id: 'rel139', source: 'user2', target: 'jtbd21', type: 'DOES' }, 
    { id: 'rel140', source: 'jtbd21', target: 'data1', type: 'READS' },
    { id: 'rel141', source: 'jtbd21', target: 'data7', type: 'READS' },
    { id: 'rel142', source: 'jtbd21', target: 'data8', type: 'READS' },
    { id: 'rel143', source: 'jtbd21', target: 'data5', type: 'READS' },
    { id: 'rel144', source: 'jtbd21', target: 'data8', type: 'UPDATES' },
    { id: 'rel145', source: 'jtbd21', target: 'data5', type: 'UPDATES' },
    
    // Check In Patient relationships
    { id: 'rel146', source: 'user3', target: 'jtbd22', type: 'DOES' }, 
    { id: 'rel147', source: 'user9', target: 'jtbd22', type: 'DOES' }, 
    { id: 'rel148', source: 'jtbd22', target: 'data1', type: 'READS' },
    { id: 'rel149', source: 'jtbd22', target: 'data3', type: 'READS' },
    { id: 'rel150', source: 'jtbd22', target: 'data22', type: 'READS' },
    { id: 'rel151', source: 'jtbd22', target: 'data1', type: 'UPDATES' },
    { id: 'rel152', source: 'jtbd22', target: 'data22', type: 'UPDATES' },
    
    // Provide Visitor Pass relationships
    { id: 'rel153', source: 'user5', target: 'jtbd23', type: 'DOES' }, 
    { id: 'rel154', source: 'user6', target: 'jtbd23', type: 'DOES' }, 
    { id: 'rel155', source: 'jtbd23', target: 'data1', type: 'READS' }, 
    { id: 'rel156', source: 'jtbd23', target: 'data23', type: 'READS' }, 
    { id: 'rel157', source: 'jtbd23', target: 'data23', type: 'WRITES' }, 
    
    // Conduct Rounds relationships
    { id: 'rel158', source: 'user1', target: 'jtbd24', type: 'DOES' }, 
    { id: 'rel159', source: 'user2', target: 'jtbd24', type: 'DOES' }, 
    { id: 'rel160', source: 'jtbd24', target: 'data1', type: 'READS' },
    { id: 'rel161', source: 'jtbd24', target: 'data5', type: 'READS' },
    { id: 'rel162', source: 'jtbd24', target: 'data4', type: 'READS' },
    { id: 'rel163', source: 'jtbd24', target: 'data5', type: 'UPDATES' },
    
    // Administer Medication relationships
    { id: 'rel164', source: 'user2', target: 'jtbd25', type: 'DOES' }, 
    { id: 'rel165', source: 'jtbd25', target: 'data5', type: 'READS' },
    { id: 'rel166', source: 'jtbd25', target: 'data12', type: 'READS' },
    { id: 'rel167', source: 'jtbd25', target: 'data3', type: 'READS' },
    { id: 'rel168', source: 'jtbd25', target: 'data5', type: 'UPDATES' },
    
    // Process Insurance relationships
    { id: 'rel169', source: 'user3', target: 'jtbd26', type: 'DOES' }, 
    { id: 'rel170', source: 'jtbd26', target: 'data3', type: 'READS' },
    { id: 'rel171', source: 'jtbd26', target: 'data5', type: 'READS' },
    { id: 'rel172', source: 'jtbd26', target: 'data25', type: 'READS' },
    { id: 'rel173', source: 'jtbd26', target: 'data25', type: 'WRITES' },
    { id: 'rel174', source: 'jtbd26', target: 'data25', type: 'UPDATES' },
    
    // Handle Incident Report relationships
    { id: 'rel175', source: 'user7', target: 'jtbd27', type: 'DOES' }, 
    { id: 'rel176', source: 'user9', target: 'jtbd27', type: 'DOES' }, 
    { id: 'rel177', source: 'jtbd27', target: 'data3', type: 'READS' },
    { id: 'rel178', source: 'jtbd27', target: 'data7', type: 'READS' },
    { id: 'rel179', source: 'jtbd27', target: 'data20', type: 'WRITES' },
    { id: 'rel180', source: 'jtbd27', target: 'data5', type: 'UPDATES' },
    
    // Manage Allergies relationships
    { id: 'rel181', source: 'user1', target: 'jtbd28', type: 'DOES' }, 
    { id: 'rel182', source: 'user2', target: 'jtbd28', type: 'DOES' }, 
    { id: 'rel183', source: 'jtbd28', target: 'data3', type: 'READS' },
    { id: 'rel184', source: 'jtbd28', target: 'data5', type: 'READS' },
    { id: 'rel185', source: 'jtbd28', target: 'data10', type: 'READS' },
    { id: 'rel186', source: 'jtbd28', target: 'data5', type: 'UPDATES' },
    { id: 'rel187', source: 'jtbd28', target: 'data10', type: 'UPDATES' },
    
    // Update Medical History relationships
    { id: 'rel188', source: 'user1', target: 'jtbd29', type: 'DOES' }, 
    { id: 'rel189', source: 'jtbd29', target: 'data3', type: 'READS' },
    { id: 'rel190', source: 'jtbd29', target: 'data4', type: 'READS' },
    { id: 'rel191', source: 'jtbd29', target: 'data5', type: 'READS' },
    { id: 'rel192', source: 'jtbd29', target: 'data5', type: 'WRITES' },
    { id: 'rel193', source: 'jtbd29', target: 'data5', type: 'UPDATES' },
    
    // Process Referral relationships
    { id: 'rel194', source: 'user1', target: 'jtbd30', type: 'DOES' }, 
    { id: 'rel195', source: 'user3', target: 'jtbd30', type: 'DOES' }, 
    { id: 'rel196', source: 'jtbd30', target: 'data1', type: 'READS' },
    { id: 'rel197', source: 'jtbd30', target: 'data5', type: 'READS' },
    { id: 'rel198', source: 'jtbd30', target: 'data5', type: 'WRITES' },
    { id: 'rel199', source: 'jtbd30', target: 'data5', type: 'UPDATES' },
    
    // Sanitize Equipment relationships
    { id: 'rel200', source: 'user2', target: 'jtbd31', type: 'DOES' }, 
    { id: 'rel201', source: 'user9', target: 'jtbd31', type: 'DOES' }, 
    { id: 'rel202', source: 'jtbd31', target: 'data13', type: 'READS' },
    { id: 'rel203', source: 'jtbd31', target: 'data7', type: 'READS' },
    { id: 'rel204', source: 'jtbd31', target: 'data13', type: 'UPDATES' },
    
    // Create Care Plan relationships
    { id: 'rel205', source: 'user1', target: 'jtbd32', type: 'DOES' }, 
    { id: 'rel206', source: 'user2', target: 'jtbd32', type: 'DOES' }, 
    { id: 'rel207', source: 'jtbd32', target: 'data3', type: 'READS' },
    { id: 'rel208', source: 'jtbd32', target: 'data4', type: 'READS' },
    { id: 'rel209', source: 'jtbd32', target: 'data5', type: 'READS' },
    { id: 'rel210', source: 'jtbd32', target: 'data6', type: 'READS' },
    { id: 'rel211', source: 'jtbd32', target: 'data5', type: 'WRITES' },
    { id: 'rel212', source: 'jtbd32', target: 'data5', type: 'UPDATES' },
    
    // Document Patient Encounter relationships
    { id: 'rel213', source: 'user1', target: 'jtbd33', type: 'DOES' }, 
    { id: 'rel214', source: 'user2', target: 'jtbd33', type: 'DOES' }, 
    { id: 'rel215', source: 'jtbd33', target: 'data3', type: 'READS' },
    { id: 'rel216', source: 'jtbd33', target: 'data5', type: 'READS' },
    { id: 'rel217', source: 'jtbd33', target: 'data5', type: 'WRITES' },
    { id: 'rel218', source: 'jtbd33', target: 'data5', type: 'UPDATES' },
    
    // Coordinate Follow-up relationships
    { id: 'rel219', source: 'user2', target: 'jtbd34', type: 'DOES' }, 
    { id: 'rel220', source: 'user3', target: 'jtbd34', type: 'DOES' }, 
    { id: 'rel221', source: 'jtbd34', target: 'data1', type: 'READS' },
    { id: 'rel222', source: 'jtbd34', target: 'data5', type: 'READS' },
    { id: 'rel223', source: 'jtbd34', target: 'data22', type: 'READS' },
    { id: 'rel224', source: 'jtbd34', target: 'data22', type: 'UPDATES' },
  ]
};

export default mockData;
