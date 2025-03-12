# Nova Modelling - Implementation Guide

This repository contains the tools and instructions for implementing the Nova modelling technique, a strategic approach for mapping complex SaaS systems. If you're not familiar with Nova modelling, please first read [the detailed blog post](https://example.com/nova-modelling) to understand its core concepts and benefits.

## Quick Overview

Nova modelling uses a graph-based approach to visualize three key aspects of any system:
- **Jobs To Be Done (JTBD)**: Core business functions the system must perform
- **Users**: People, roles, or systems that interact with these functions
- **Data**: Information elements that are read, written, or updated by each job

## Toolchain Setup

Nova modelling requires three tools working together:

1. **Data Collection (Google Sheets)**
   - Captures structured information about JTBDs, Users, and Data interactions
   - Provides a collaborative interface for product and technical teams

2. **Graph Generation (This Repository)**
   - Transforms spreadsheet data into Neo4j Cypher queries
   - Maintains consistency across the model

3. **Visualization (Neo4j)**
   - Creates interactive graph visualizations
   - Enables analysis and decision-making based on the model

## Prerequisites

- Google Account with access to Google Sheets
- Neo4j database (Recommend [Neo4j Aura](https://neo4j.com/aura/) cloud service for quick setup)
- Basic understanding of graph database concepts

## Implementation Steps

### 1. Set Up Data Collection

Create a new Google Spreadsheet with the following columns:
- Column A: **JTBD Name** (core system function)
- Column B: **Users** (roles/systems involved, semicolon-separated for multiple users)
- Column C: **Data Read** (input data requirements, semicolon-separated for multiple data items)
- Column D: **Data Created** (output data generated, semicolon-separated for multiple data items)
- Column E: **Data Updated** (modified data, semicolon-separated for multiple data items)

### 2. Install Automation Script

1. In your Google Sheet, go to Extensions > Apps Script
2. Copy the `generateNovaModelCypher.js` code from this repository into the script editor
3. Save the project with a name like "Nova Modelling"
4. Refresh your Google Sheet
5. A new menu item "Nova Modelling" should appear in the toolbar

### 3. Data Entry Process

Following system analysis, enter your data in the spreadsheet using this format:

```
| JTBD Name          | Users                           | Data Read                             | Data Created    | Data Updated         |
|--------------------|---------------------------------|---------------------------------------|-----------------|----------------------|
| Diagnose Patient   | Doctor                          | Patient List;Diseases;Patient Details | Diagnosis       | Patient Record       |
| Find Patient       | Doctor;Nurse;Security Guard     | Patient List;Facilities               |                 |                      |
| Prescribe Treatment| Doctor;Nurse                    | Patient Record;Diagnosis;Treatments   | Patient Record  |                      |
```

### 3. Generate Model

1. Click the "Nova Modelling" menu item
2. Select "Generate Cypher"
3. A new sheet named "cypher" will be created with Neo4j-compatible queries

### 5. Import into Neo4j

1. Copy the generated Cypher queries
2. Open your Neo4j browser interface
3. Paste and execute the queries to build your graph model

## Data Interaction Hierarchy

The Nova model employs a hierarchy of data interaction complexity that directly correlates with implementation complexity and resource requirements:

1. **Data READ**:
   - Lowest complexity level
   - JTBD only consumes existing data
   - No data modifications
   - Typically requires fewer resources to implement

2. **Data UPDATE**:
   - Medium complexity level
   - JTBD modifies existing data entities
   - Requires validation and consistency checks
   - Assumes READ capabilities as a prerequisite

3. **Data CREATE**:
   - Highest complexity level
   - JTBD generates entirely new data entries
   - System becomes the "master" or authoritative source for this data
   - Implies both READ and UPDATE capabilities
   - Typically requires more development resources and architectural attention

This hierarchy helps technology leaders identify which system components will require more resources and architectural attention due to their higher complexity. Systems that primarily CREATE data typically require more development effort and have more downstream dependencies than those that primarily READ data.

## Handling Many-to-Many Relationships

The spreadsheet format uses semicolon-separated values to represent many-to-many relationships. For example:

```
| JTBD Name          | Users                     | Data Read                        | Data Created    | Data Updated     |
|--------------------|---------------------------|---------------------------------|-----------------|------------------|
| Process Application| Reviewer;Admin            | Application;User Profile        | Decision        | Application      |
```

This entry creates:
- Two User nodes (Reviewer, Admin)
- Two Data Read nodes (Application, User Profile)
- One Data Created node (Decision)
- One Data Updated node (Application)
- Multiple relationships connecting these nodes to the JTBD

The transformation script handles these relationships automatically, generating the appropriate Cypher queries to establish all connections.

## Example Model

The `create_model_EXAMPLE.cypher` file in this repository demonstrates a complete model from the healthcare domain. While the examples use healthcare terms, the same principles apply to any domain:

- E-commerce: Products, Orders, Customers
- Finance: Accounts, Transactions, Users
- Education: Students, Courses, Instructors
- Enterprise: Employees, Departments, Projects

## Analyzing the Generated Model

Once your model is in Neo4j, use these queries to explore different aspects:

```cypher
// View all JTBDs and their connected Users
MATCH (j:JTBD)<-[:DOES]-(u:User)
RETURN j.name, collect(u.name) as Users

// Find the most complex JTBDs (those with the most data interactions)
MATCH (j:JTBD)-[r]->(d:Data)
WITH j, count(r) as interactions
RETURN j.name, interactions
ORDER BY interactions DESC
LIMIT 10

// Identify potential system boundaries (clusters of JTBDs that share data)
MATCH (j1:JTBD)-[]->(d:Data)<-[]-(j2:JTBD)
WHERE j1 <> j2
RETURN j1.name, j2.name, count(d) as shared_data
ORDER BY shared_data DESC
```

## Theoretical Foundation

The Nova model's complexity calculations are grounded in Fred Brooks' seminal work ["No Silver Bullet — Essence and Accident in Software Engineering"](http://worrydream.com/refs/Brooks-NoSilverBullet.pdf) from The Mythical Man Month. Brooks identifies two types of complexity in software development:

1. **Essential Complexity**: The inherent complexity of the problem space itself - what the users need to accomplish
2. **Accidental Complexity (Toil)**: The additional complexity that comes from implementing the solution - databases, APIs, networking, etc.

The model quantifies these complexities:

- Essential complexity is captured in the JTBD interactions (READ=1, UPDATE=3, WRITE=5)
- Accidental complexity is represented by the TOIL_FACTOR (default 1.8, representing an 80/20 split)
- Each Data node adds a base complexity cost (default 10) for building and maintaining its API

### Using the Model to Reduce Toil

The model becomes a powerful tool for "playing the multiverse":

1. **Measure Current State**: Initially measure the essential/accidental complexity split in team backlogs
2. **Target Improvements**: Identify opportunities to reduce toil:
   - Share microservice templates between teams
   - Standardize common services (identity, logging, etc.)
   - Create reusable API patterns
3. **Simulate Impact**: Adjust the TOIL_FACTOR and DATA_NODE_COST to predict delivery timelines
4. **Validate and Calibrate**: As work is completed, feed actual metrics back into the model

This creates a feedback loop: if the model accurately predicts past delivery times, it becomes more reliable at predicting future timelines.

## Advanced Customization

### Adding Complexity Metrics

The basic model can be enhanced with additional metrics to better quantify complexity:

```cypher
// Set complexity based on data interaction types
MATCH (j:JTBD)
OPTIONAL MATCH (j)-[:READS]->(dr:Data)
WITH j, count(dr) as reads
OPTIONAL MATCH (j)-[:UPDATES]->(du:Data)
WITH j, reads, count(du) as updates
OPTIONAL MATCH (j)-[:WRITES]->(dw:Data)
WITH j, reads, updates, count(dw) as writes
SET j.complexity = reads + (updates * 2) + (writes * 3)
RETURN j.name, j.complexity
ORDER BY j.complexity DESC
```

This calculation applies a weighted formula where:
- READ operations = 1 point
- UPDATE operations = 2 points
- CREATE operations = 3 points

### Calculating Delivery Estimates

Using the complexity metrics, you can generate delivery estimates:

```cypher
// Calculate total system effort based on complexity
MATCH (j:JTBD)
WHERE j.complexity IS NOT NULL
RETURN sum(j.complexity) as total_complexity,
       sum(j.complexity) / 20 as estimated_team_months
```

## Maintenance and Evolution

The Nova model should be maintained as a living document that evolves with your system:

1. **Regular Updates**: As new features are planned, add them to the spreadsheet
2. **Progress Tracking**: Add columns for implementation status, priority, etc.
3. **Version Control**: Save iterations of your model to track system evolution

## Troubleshooting

### Common Issues

1. **Duplicate Nodes**: Caused by inconsistent naming (e.g., "User" vs "Users")
   - Solution: Standardize naming conventions

2. **Missing Relationships**: Often due to typos in data entry
   - Solution: Review and correct spreadsheet entries

3. **Script Errors**: Can occur with large datasets
   - Solution: Split generation into smaller batches

## Support and Contribution

If you encounter issues or want to contribute to improving the Nova modelling toolchain, please create an issue or pull request in this repository.

---

Happy modelling! Use this approach to bring clarity and strategic alignment to your next complex SaaS build.
