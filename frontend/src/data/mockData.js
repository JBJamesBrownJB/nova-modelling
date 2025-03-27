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
  ]
};

export default mockData;
