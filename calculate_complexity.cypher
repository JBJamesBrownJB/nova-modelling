MATCH (j:JTBD)-[r:READS]->(d:Data) WITH j, count(r) as essential_readers SET j.essential_readers = essential_readers * 1;
MATCH (j:JTBD)-[u:UPDATES]->(d:Data) WITH j, count(u) as essential_updaters SET j.essential_updaters = essential_updaters * 3;
MATCH (j:JTBD)-[w:WRITES]->(d:Data) WITH j, count(w) as essential_writers SET j.essential_writers = essential_writers * 5;

MATCH (d:Data)<-[r:READS]-() WITH d, count(r) as accidental_readers SET d.accidental_readers = accidental_readers;

MATCH (j:JTBD)<-[d:DOES]-() WITH j, count(d) as toil_multiplyer SET j.toil_multiplyer = toil_multiplyer;

WITH 1 as ESSENTIAL_READ_COMPLEXITY, 3 as ESSENTIAL_UPDATE_COMPLEXITY, 5 as ESSENTIAL_WRITE_COMPLEXITY,
     1.8 as TOIL_FACTOR,  // Accidental complexity ratio (80/20 split = 1.8)
     10 as DATA_NODE_COST // Base cost of building and maintaining a data API
MATCH (j:JTBD) SET j.complexity = 
((j.essential_readers * ESSENTIAL_READ_COMPLEXITY)
+ (j.essential_updaters * ESSENTIAL_UPDATE_COMPLEXITY)
+ (j.essential_writers * ESSENTIAL_WRITE_COMPLEXITY)) * j.toil_multiplyer
SET j.estimate = (j.complexity * TOIL_FACTOR) + ' days';

MATCH (d:Data) WHERE d.accidental_readers > 1 
SET d.complexity = DATA_NODE_COST, 
    d.estimate = (DATA_NODE_COST * TOIL_FACTOR) + ' days';