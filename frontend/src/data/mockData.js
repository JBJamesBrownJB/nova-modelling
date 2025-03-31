// Mock data based on healthcare model example from create_model_EXAMPLE.cypher
const mockData = {
  nodes: [
    // Goal Nodes
    { id: 'Goal1', label: 'Goal', name: 'Diagnose Patient' },
    { id: 'Goal2', label: 'Goal', name: 'Re-diagnose patient' },
    { id: 'Goal3', label: 'Goal', name: 'Find Patient' },
    { id: 'Goal4', label: 'Goal', name: 'Prescribe treatment' },
    { id: 'Goal5', label: 'Goal', name: 'Assign bed' },
    { id: 'Goal6', label: 'Goal', name: 'Choose Meal' },
    { id: 'Goal7', label: 'Goal', name: 'Discharge Patient' },
    { id: 'Goal8', label: 'Goal', name: 'Treat Patient' },
    { id: 'Goal9', label: 'Goal', name: 'Monitor Patient' },
    { id: 'Goal10', label: 'Goal', name: 'Assign shift' },
    { id: 'Goal11', label: 'Goal', name: 'View on duty staff' },
    { id: 'Goal12', label: 'Goal', name: 'Contact on duty doctor' },
    { id: 'Goal13', label: 'Goal', name: 'Request clean up' },
    { id: 'Goal14', label: 'Goal', name: 'Pay Invoice' },
    { id: 'Goal15', label: 'Goal', name: 'This has a rather long name, maybe in future these will have title and description' },
    
    // New Goal nodes (healthcare related)
    { id: 'Goal35', label: 'Goal', name: 'Schedule Appointment' },
    { id: 'Goal16', label: 'Goal', name: 'Order Medication' },
    { id: 'Goal17', label: 'Goal', name: 'Perform Lab Test' },
    { id: 'Goal18', label: 'Goal', name: 'Review Lab Results' },
    { id: 'Goal19', label: 'Goal', name: 'Manage Patient Records' },
    { id: 'Goal20', label: 'Goal', name: 'Triage Emergency' },
    { id: 'Goal21', label: 'Goal', name: 'Transfer Patient' },
    { id: 'Goal22', label: 'Goal', name: 'Check In Patient' },
    { id: 'Goal23', label: 'Goal', name: 'Provide Visitor Pass' },
    { id: 'Goal24', label: 'Goal', name: 'Conduct Rounds' },
    { id: 'Goal25', label: 'Goal', name: 'Administer Medication' },
    { id: 'Goal26', label: 'Goal', name: 'Process Insurance' },
    { id: 'Goal27', label: 'Goal', name: 'Handle Incident Report' },
    { id: 'Goal28', label: 'Goal', name: 'Manage Allergies' },
    { id: 'Goal29', label: 'Goal', name: 'Update Medical History' },
    { id: 'Goal30', label: 'Goal', name: 'Process Referral' },
    { id: 'Goal31', label: 'Goal', name: 'Sanitize Equipment' },
    { id: 'Goal32', label: 'Goal', name: 'Create Care Plan' },
    { id: 'Goal33', label: 'Goal', name: 'Document Patient Encounter' },
    { id: 'Goal34', label: 'Goal', name: 'Coordinate Follow-up' },
    
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
    { id: 'service1', label: 'Service', name: 'Patient Management', status: 'active' },
    { id: 'service2', label: 'Service', name: 'Disease Reference',  status: 'active' },
    { id: 'service3', label: 'Service', name: 'Patient Profile',  status: 'active' },
    { id: 'service4', label: 'Service', name: 'Diagnosis System',  status: 'active' },
    { id: 'service5', label: 'Service', name: 'Electronic Health Records',  status: 'in_development' },
    { id: 'service6', label: 'Service', name: 'Treatment Catalog',  status: 'in_development' },
    { id: 'service7', label: 'Service', name: 'Facility Management',  status: 'active' },
    { id: 'service8', label: 'Service', name: 'Bed Management',  status: 'active' },
    { id: 'service9', label: 'Service', name: 'Nutrition Management',  status: 'in_development' },
    { id: 'service10', label: 'Service', name: 'Allergen Repository',  status: 'vapourware' },
    { id: 'service11', label: 'Service', name: 'Meal Ordering',  status: 'vapourware' },
    { id: 'service12', label: 'Service', name: 'Pharmacy System',  status: 'active' },
    { id: 'service13', label: 'Service', name: 'Equipment Management',  status: 'in_development' },
    { id: 'service14', label: 'Service', name: 'Vital Signs Monitoring',  status: 'active' },
    { id: 'service15', label: 'Service', name: 'Blood Pressure Monitoring', consumers: 1},
    { id: 'service16', label: 'Service', name: 'Temperature Monitoring',  status: 'active' },
    { id: 'service17', label: 'Service', name: 'Visual Monitoring',  status: 'vapourware' },
    { id: 'service18', label: 'Service', name: 'Alert System',  status: 'in_development' },
    { id: 'service19', label: 'Service', name: 'Staff Scheduling',  status: 'active' },
    { id: 'service20', label: 'Service', name: 'Notification System', consumers: 2 },
    { id: 'service21', label: 'Service', name: 'Shift Management',  status: 'active' },
    { id: 'service22', label: 'Service', name: 'Calendar System',  status: 'active' },
    { id: 'service23', label: 'Service', name: 'Staff Directory',  status: 'active' },
    { id: 'service24', label: 'Service', name: 'Housekeeping Services',  status: 'vapourware' },
    { id: 'service25', label: 'Service', name: 'Billing System',  status: 'active' },
  ],
  links: [
    // Doctor relationships
    { id: 'rel1', source: 'user1', target: 'Goal1', type: 'DOES', nps: 85 },
    { id: 'rel2', source: 'user1', target: 'Goal2', type: 'DOES', nps: 45 },
    { id: 'rel3', source: 'user1', target: 'Goal3', type: 'DOES', nps: null },
    { id: 'rel4', source: 'user1', target: 'Goal4', type: 'DOES', nps: 75 },
    { id: 'rel5', source: 'user1', target: 'Goal5', type: 'DOES', nps: null },
    { id: 'rel6', source: 'user1', target: 'Goal7', type: 'DOES', nps: -15 },
    { id: 'rel7', source: 'user1', target: 'Goal8', type: 'DOES', nps: -20 },
    { id: 'rel8', source: 'user1', target: 'Goal9', type: 'DOES', nps: 20 },
    { id: 'rel9', source: 'user1', target: 'Goal10', type: 'DOES' },
    { id: 'rel10', source: 'user1', target: 'Goal11', type: 'DOES', nps: 90 },
    { id: 'rel11', source: 'user1', target: 'Goal13', type: 'DOES', nps: -90 },
    
    // Nurse relationships
    { id: 'rel12', source: 'user2', target: 'Goal3', type: 'DOES', nps: 65 },
    { id: 'rel13', source: 'user2', target: 'Goal5', type: 'DOES', nps: null },
    { id: 'rel14', source: 'user2', target: 'Goal7', type: 'DOES', nps: 55 },
    { id: 'rel15', source: 'user2', target: 'Goal8', type: 'DOES', nps: null },
    { id: 'rel16', source: 'user2', target: 'Goal9', type: 'DOES', nps: 30 },
    { id: 'rel17', source: 'user2', target: 'Goal10', type: 'DOES' },
    { id: 'rel18', source: 'user2', target: 'Goal11', type: 'DOES', nps: -40 },
    { id: 'rel19', source: 'user2', target: 'Goal13', type: 'DOES', nps: null },
    
    // Patient relationships
    { id: 'rel20', source: 'user4', target: 'Goal6', type: 'DOES' },
    { id: 'rel21', source: 'user4', target: 'Goal7', type: 'DOES', nps: null },
    
    // Add missing relationships for Contact on duty doctor
    { id: 'rel53', source: 'user2', target: 'Goal12', type: 'DOES', nps: -60 }, 
    { id: 'rel54', source: 'Goal12', target: 'service19', type: 'DEPENDS_ON', nps: null }, 
    { id: 'rel55', source: 'Goal12', target: 'service23', type: 'DEPENDS_ON', nps: null }, 
    
    // Add missing relationships for Pay Invoice
    { id: 'rel56', source: 'user4', target: 'Goal14', type: 'DOES', nps: -80 }, 
    { id: 'rel57', source: 'user3', target: 'Goal14', type: 'DOES', nps: null }, 
    { id: 'rel58', source: 'Goal14', target: 'service25', type: 'DEPENDS_ON', nps: null }, 
    
    // Connect Security Guard
    { id: 'rel60', source: 'user5', target: 'Goal23', type: 'DOES', nps: 10 }, 
    
    // Connect Family Member
    { id: 'rel61', source: 'user6', target: 'Goal23', type: 'DOES', nps: 50 }, 
    
    // Connect Police
    { id: 'rel62', source: 'user7', target: 'Goal27', type: 'DOES', nps: -30 }, 
    
    // Connect Porter
    { id: 'rel63', source: 'user8', target: 'Goal21', type: 'DOES', nps: 60 }, 
    
    // Connect Staff with unassigned Goals
    { id: 'rel64', source: 'user9', target: 'Goal13', type: 'DOES', nps: -10 }, 
    { id: 'rel65', source: 'user9', target: 'Goal22', type: 'DOES', nps: 70 }, 
    
    // Service dependencies for Find Patient
    { id: 'rel66', source: 'Goal3', target: 'service1', type: 'DEPENDS_ON' },
    { id: 'rel67', source: 'Goal3', target: 'service3', type: 'DEPENDS_ON' },
    
    // Service dependencies for Prescribe treatment
    { id: 'rel68', source: 'Goal4', target: 'service4', type: 'DEPENDS_ON' },
    { id: 'rel69', source: 'Goal4', target: 'service6', type: 'DEPENDS_ON' },
    { id: 'rel70', source: 'Goal4', target: 'service12', type: 'DEPENDS_ON' },
    { id: 'rel71', source: 'Goal4', target: 'service5', type: 'DEPENDS_ON' },
    
    // Service dependencies for Assign bed
    { id: 'rel72', source: 'Goal5', target: 'service8', type: 'DEPENDS_ON' },
    
    // Service dependencies for Choose Meal
    { id: 'rel74', source: 'Goal6', target: 'service9', type: 'DEPENDS_ON' },
    { id: 'rel75', source: 'Goal6', target: 'service10', type: 'DEPENDS_ON' },
    { id: 'rel76', source: 'Goal6', target: 'service11', type: 'DEPENDS_ON' },
    
    // Service dependencies for Discharge Patient
    { id: 'rel77', source: 'Goal7', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel78', source: 'Goal7', target: 'service4', type: 'DEPENDS_ON' },
    { id: 'rel79', source: 'Goal7', target: 'service25', type: 'DEPENDS_ON' },
    
    // Service dependencies for Diagnose Patient
    { id: 'rel22', source: 'Goal1', target: 'service1', type: 'DEPENDS_ON' },
    { id: 'rel23', source: 'Goal1', target: 'service2', type: 'DEPENDS_ON' },
    { id: 'rel24', source: 'Goal1', target: 'service3', type: 'DEPENDS_ON' },
    { id: 'rel25', source: 'Goal1', target: 'service4', type: 'DEPENDS_ON' },
    { id: 'rel26', source: 'Goal1', target: 'service5', type: 'DEPENDS_ON' },
    
    // DEPENDS_ON relationships for Re-diagnose patient
    { id: 'rel27', source: 'Goal2', target: 'service1', type: 'DEPENDS_ON' },
    { id: 'rel28', source: 'Goal2', target: 'service2', type: 'DEPENDS_ON' },
    { id: 'rel29', source: 'Goal2', target: 'service3', type: 'DEPENDS_ON' },
    { id: 'rel30', source: 'Goal2', target: 'service4', type: 'DEPENDS_ON' },
    { id: 'rel31', source: 'Goal2', target: 'service5', type: 'DEPENDS_ON' },
    
    // Service dependencies for Treat Patient
    { id: 'rel32', source: 'Goal8', target: 'service4', type: 'DEPENDS_ON' },
    { id: 'rel33', source: 'Goal8', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel34', source: 'Goal8', target: 'service6', type: 'DEPENDS_ON' },
    { id: 'rel35', source: 'Goal8', target: 'service12', type: 'DEPENDS_ON' },
    { id: 'rel36', source: 'Goal8', target: 'service13', type: 'DEPENDS_ON' },
    
    // Service dependencies for Monitor Patient
    { id: 'rel37', source: 'Goal9', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel38', source: 'Goal9', target: 'service14', type: 'DEPENDS_ON' },
    { id: 'rel39', source: 'Goal9', target: 'service15', type: 'DEPENDS_ON' },
    { id: 'rel40', source: 'Goal9', target: 'service16', type: 'DEPENDS_ON' },
    { id: 'rel41', source: 'Goal9', target: 'service17', type: 'DEPENDS_ON' },
    { id: 'rel42', source: 'Goal9', target: 'service18', type: 'DEPENDS_ON' },
    
    // Service dependencies for Assign shift
    { id: 'rel43', source: 'Goal10', target: 'service19', type: 'DEPENDS_ON' },
    { id: 'rel44', source: 'Goal10', target: 'service21', type: 'DEPENDS_ON' },
    { id: 'rel45', source: 'Goal10', target: 'service22', type: 'DEPENDS_ON' },
    { id: 'rel46', source: 'Goal10', target: 'service23', type: 'DEPENDS_ON' },
    
    // Service dependencies for View on duty staff
    { id: 'rel47', source: 'Goal11', target: 'service19', type: 'DEPENDS_ON' },
    { id: 'rel48', source: 'Goal11', target: 'service21', type: 'DEPENDS_ON' },
    { id: 'rel49', source: 'Goal11', target: 'service23', type: 'DEPENDS_ON' },
    
    // Service dependencies for Request clean up
    { id: 'rel50', source: 'Goal13', target: 'service7', type: 'DEPENDS_ON' },
    { id: 'rel51', source: 'Goal13', target: 'service24', type: 'DEPENDS_ON' },
    
    // Add dependencies for additional Goals
    { id: 'rel80', source: 'Goal15', target: 'service22', type: 'DEPENDS_ON' },
    { id: 'rel81', source: 'Goal15', target: 'service19', type: 'DEPENDS_ON' },
    { id: 'rel82', source: 'Goal15', target: 'service1', type: 'DEPENDS_ON' },
    
    { id: 'rel83', source: 'Goal35', target: 'service22', type: 'DEPENDS_ON' },
    { id: 'rel84', source: 'Goal35', target: 'service19', type: 'DEPENDS_ON' },
    { id: 'rel85', source: 'Goal35', target: 'service1', type: 'DEPENDS_ON' },
    
    { id: 'rel86', source: 'Goal16', target: 'service12', type: 'DEPENDS_ON' },
    { id: 'rel87', source: 'Goal16', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel88', source: 'Goal17', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel89', source: 'Goal18', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel90', source: 'Goal19', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel91', source: 'Goal19', target: 'service1', type: 'DEPENDS_ON' },
    { id: 'rel92', source: 'Goal19', target: 'service3', type: 'DEPENDS_ON' },
    
    { id: 'rel93', source: 'Goal20', target: 'service18', type: 'DEPENDS_ON' },
    { id: 'rel94', source: 'Goal20', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel95', source: 'Goal21', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel96', source: 'Goal21', target: 'service7', type: 'DEPENDS_ON' },
    { id: 'rel97', source: 'Goal21', target: 'service8', type: 'DEPENDS_ON' },
    
    { id: 'rel98', source: 'Goal22', target: 'service1', type: 'DEPENDS_ON' },
    { id: 'rel99', source: 'Goal22', target: 'service3', type: 'DEPENDS_ON' },
    
    { id: 'rel100', source: 'Goal23', target: 'service7', type: 'DEPENDS_ON' },
    
    { id: 'rel101', source: 'Goal24', target: 'service8', type: 'DEPENDS_ON' },
    { id: 'rel102', source: 'Goal24', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel103', source: 'Goal25', target: 'service12', type: 'DEPENDS_ON' },
    { id: 'rel104', source: 'Goal25', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel105', source: 'Goal26', target: 'service25', type: 'DEPENDS_ON' },
    { id: 'rel106', source: 'Goal26', target: 'service5', type: 'DEPENDS_ON' },
    
    { id: 'rel107', source: 'Goal27', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel108', source: 'Goal27', target: 'service20', type: 'DEPENDS_ON' },
    
    { id: 'rel109', source: 'Goal28', target: 'service5', type: 'DEPENDS_ON' },
    { id: 'rel110', source: 'Goal28', target: 'service10', type: 'DEPENDS_ON' },
  ]
};

const mockDataMinimal = {
  nodes: [
    { id: 'user1', label: 'User', name: 'Test User', Goal_count: 0 },
    { id: 'goal1', label: 'Goal', name: 'Test Goal', complexity: 8 },
    { id: 'service1', label: 'Service', name: 'Test Service', dependants: 0, status: 'active' }
  ],
  links: [
    { source: 'user1', target: 'goal1', type: 'DOES' },
    { source: 'goal1', target: 'service1', type: 'DEPENDS_ON' }
  ]
};

export default mockData;
export { mockDataMinimal };
