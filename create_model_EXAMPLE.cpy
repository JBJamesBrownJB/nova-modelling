MERGE (jtbd:JTBD {name: 'Diagnose Patient', progress: 0})
MERGE (a0:Actor {name: 'Doctor'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Patient List'})
MERGE (d1:Data {name: 'Diseases'})
MERGE (d2:Data {name: 'Patient Details'})
MERGE (d3:Data {name: 'Diagnosis'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[reads3:READS]->(d3)
MERGE (jtbd)-[writes0:WRITES]->(d0)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
;
MERGE (jtbd:JTBD {name: 'Re-diagnose patient', progress: 0})
MERGE (a0:Actor {name: 'Doctor'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Patient List'})
MERGE (d1:Data {name: 'Diseases'})
MERGE (d2:Data {name: 'Patient Details'})
MERGE (d3:Data {name: 'Diagnosis'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[reads3:READS]->(d3)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
;
MERGE (jtbd:JTBD {name: 'Find Patient', progress: 0})
MERGE (a0:Actor {name: 'Doctor'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Nurse'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (a2:Actor {name: 'Security Guard'})
MERGE (a2)-[does2:DOES]->(jtbd)
MERGE (a3:Actor {name: 'Family Member'})
MERGE (a3)-[does3:DOES]->(jtbd)
MERGE (a4:Actor {name: 'Police'})
MERGE (a4)-[does4:DOES]->(jtbd)
MERGE (d0:Data {name: 'Patient List'})
MERGE (d1:Data {name: 'Facilitites'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
;
MERGE (jtbd:JTBD {name: 'Prescribe treatment', progress: 0})
MERGE (a0:Actor {name: 'Doctor'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Patient Record'})
MERGE (d1:Data {name: 'Diagnosis'})
MERGE (d2:Data {name: 'Treatments'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[writes0:WRITES]->(d0)
;
MERGE (jtbd:JTBD {name: 'Assign bed', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Nurse'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (a2:Actor {name: 'Doctor'})
MERGE (a2)-[does2:DOES]->(jtbd)
MERGE (d0:Data {name: 'Facilitites'})
MERGE (d1:Data {name: 'Beds'})
MERGE (d2:Data {name: 'Patient Details'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
;
MERGE (jtbd:JTBD {name: 'Choose Meal', progress: 0})
MERGE (a0:Actor {name: 'Patient'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Menu'})
MERGE (d1:Data {name: 'Patient Details'})
MERGE (d2:Data {name: 'Allergens'})
MERGE (d3:Data {name: 'Bed'})
MERGE (d4:Data {name: 'Facilitites'})
MERGE (d5:Data {name: 'Meal Order'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[reads3:READS]->(d3)
MERGE (jtbd)-[reads4:READS]->(d4)
MERGE (jtbd)-[writes0:WRITES]->(d0)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
;
MERGE (jtbd:JTBD {name: 'Discharge Patient', progress: 0})
MERGE (a0:Actor {name: 'Patient'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Doctor'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (a2:Actor {name: 'Nurse'})
MERGE (a2)-[does2:DOES]->(jtbd)
MERGE (d0:Data {name: 'Patient Record'})
MERGE (d1:Data {name: 'Diagnosis'})
MERGE (d2:Data {name: 'Beds'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
MERGE (jtbd)-[updates1:UPDATES]->(d1)
;
MERGE (jtbd:JTBD {name: 'Treat Patient', progress: 0})
MERGE (a0:Actor {name: 'Doctor'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Nurse'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (d0:Data {name: 'Diagnosis'})
MERGE (d1:Data {name: 'Patient Record'})
MERGE (d2:Data {name: 'Treatments'})
MERGE (d3:Data {name: 'Medicine'})
MERGE (d4:Data {name: 'Equipment'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[reads3:READS]->(d3)
MERGE (jtbd)-[reads4:READS]->(d4)
MERGE (jtbd)-[writes0:WRITES]->(d0)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
MERGE (jtbd)-[updates1:UPDATES]->(d1)
;
MERGE (jtbd:JTBD {name: 'Monitor Patient', progress: 0})
MERGE (a0:Actor {name: 'Doctor'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Nurse'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (d0:Data {name: 'Diagnosis'})
MERGE (d1:Data {name: 'Patient Record'})
MERGE (d2:Data {name: 'Facilities'})
MERGE (d3:Data {name: 'Equipment'})
MERGE (d4:Data {name: 'Heartbeat'})
MERGE (d5:Data {name: 'Blood Preassure'})
MERGE (d6:Data {name: ' Patient Temperature'})
MERGE (d7:Data {name: ' Patient Visuals'})
MERGE (d8:Data {name: ' Assistance Alarm'})
MERGE (d9:Data {name: 'Staff Schedule'})
MERGE (d10:Data {name: 'Alerts'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[reads3:READS]->(d3)
MERGE (jtbd)-[reads4:READS]->(d4)
MERGE (jtbd)-[reads5:READS]->(d5)
MERGE (jtbd)-[reads6:READS]->(d6)
MERGE (jtbd)-[reads7:READS]->(d7)
MERGE (jtbd)-[reads8:READS]->(d8)
MERGE (jtbd)-[reads9:READS]->(d9)
MERGE (jtbd)-[writes0:WRITES]->(d0)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
;
MERGE (jtbd:JTBD {name: 'Assign shift', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Doctor'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (a2:Actor {name: 'Nurse'})
MERGE (a2)-[does2:DOES]->(jtbd)
MERGE (a3:Actor {name: 'Porter'})
MERGE (a3)-[does3:DOES]->(jtbd)
MERGE (d0:Data {name: 'Shifts'})
MERGE (d1:Data {name: 'Schedule'})
MERGE (d2:Data {name: 'Facilities'})
MERGE (d3:Data {name: 'Patient List'})
MERGE (d4:Data {name: 'Staff'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[reads3:READS]->(d3)
MERGE (jtbd)-[reads4:READS]->(d4)
MERGE (jtbd)-[writes0:WRITES]->(d0)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
;
MERGE (jtbd:JTBD {name: 'View on duty staff', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Doctor'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (a2:Actor {name: 'Nurse'})
MERGE (a2)-[does2:DOES]->(jtbd)
MERGE (d0:Data {name: 'Schedule'})
MERGE (d1:Data {name: 'Staff'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
;
MERGE (jtbd:JTBD {name: 'Contact on duty doctor', progress: 0})
MERGE (a0:Actor {name: 'Staff'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Staff'})
MERGE (d1:Data {name: 'Schedule'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
;
MERGE (jtbd:JTBD {name: 'Request clean up', progress: 0})
MERGE (a0:Actor {name: 'Doctor'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Nurse'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (d0:Data {name: 'Staff'})
MERGE (d1:Data {name: 'Schedule'})
MERGE (d2:Data {name: 'Cleaning Task'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[writes0:WRITES]->(d0)
;
MERGE (jtbd:JTBD {name: 'Clean up mess', progress: 0})
MERGE (a0:Actor {name: 'Porter'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Cleaning Task'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
;
MERGE (jtbd:JTBD {name: 'Purchase medicine', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Medicine Catalogue'})
MERGE (d1:Data {name: 'Finance'})
MERGE (d2:Data {name: 'Medicine Inventory'})
MERGE (d3:Data {name: 'Invoice'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[writes0:WRITES]->(d0)
;
MERGE (jtbd:JTBD {name: 'Track medicine inventry', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Doctor'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (a2:Actor {name: 'Nurse'})
MERGE (a2)-[does2:DOES]->(jtbd)
MERGE (d0:Data {name: 'Medicine Inventory'})
MERGE (jtbd)-[reads0:READS]->(d0)
;
MERGE (jtbd:JTBD {name: 'Handle GDPR right to forget', progress: 0})
MERGE (a0:Actor {name: 'Doctor'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Nurse'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (a2:Actor {name: 'Security Guard'})
MERGE (a2)-[does2:DOES]->(jtbd)
MERGE (a3:Actor {name: 'Family Member'})
MERGE (a3)-[does3:DOES]->(jtbd)
MERGE (a4:Actor {name: 'Police'})
MERGE (a4)-[does4:DOES]->(jtbd)
MERGE (d0:Data {name: 'Patient Details'})
MERGE (d1:Data {name: 'Diagnosis'})
MERGE (d2:Data {name: 'Staff'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[writes0:WRITES]->(d0)
MERGE (jtbd)-[writes1:WRITES]->(d1)
MERGE (jtbd)-[writes2:WRITES]->(d2)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
MERGE (jtbd)-[updates1:UPDATES]->(d1)
MERGE (jtbd)-[updates2:UPDATES]->(d2)
;
MERGE (jtbd:JTBD {name: 'View staff absence', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Staff'})
MERGE (jtbd)-[reads0:READS]->(d0)
;
MERGE (jtbd:JTBD {name: 'Arrange cover staff', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Staff'})
MERGE (d1:Data {name: 'Schedule'})
MERGE (d2:Data {name: 'Patient List'})
MERGE (d3:Data {name: 'Facilitites'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[reads3:READS]->(d3)
MERGE (jtbd)-[writes0:WRITES]->(d0)
MERGE (jtbd)-[writes1:WRITES]->(d1)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
MERGE (jtbd)-[updates1:UPDATES]->(d1)
;
MERGE (jtbd:JTBD {name: 'Send Invoice', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Invoices'})
MERGE (d1:Data {name: 'Finance'})
MERGE (d2:Data {name: 'Suppliers'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[writes0:WRITES]->(d0)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
;
MERGE (jtbd:JTBD {name: 'Pay Invoice', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (d0:Data {name: 'Invoices'})
MERGE (d1:Data {name: 'Finance'})
MERGE (d2:Data {name: 'Suppliers'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[reads2:READS]->(d2)
MERGE (jtbd)-[updates0:UPDATES]->(d0)
;
MERGE (jtbd:JTBD {name: 'View Budget', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Accountant'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (d0:Data {name: 'Finance'})
MERGE (jtbd)-[reads0:READS]->(d0)
;
MERGE (jtbd:JTBD {name: 'Assign budget', progress: 0})
MERGE (a0:Actor {name: 'Admin'})
MERGE (a0)-[does0:DOES]->(jtbd)
MERGE (a1:Actor {name: 'Accountant'})
MERGE (a1)-[does1:DOES]->(jtbd)
MERGE (d0:Data {name: 'Finance'})
MERGE (d1:Data {name: 'Budget'})
MERGE (jtbd)-[reads0:READS]->(d0)
MERGE (jtbd)-[reads1:READS]->(d1)
MERGE (jtbd)-[writes0:WRITES]->(d0)
;