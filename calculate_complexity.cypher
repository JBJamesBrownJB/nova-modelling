// NOVA COMPLEXITY MODEL
// ====================
// Based on Fred Brooks' Essential vs Accidental Complexity

// CONSTANTS
// --------
// READ_WEIGHT = 1   (Simple read operations)
// UPDATE_WEIGHT = 3 (More complex update operations)
// WRITE_WEIGHT = 5  (Most complex write operations)
// DATA_NODE_COST = 10 (Base cost of data node/API)
// TOIL_FACTOR = 1.8 (80/20 split between accidental/essential complexity)

// PART 1: CALCULATE Goal COMPLEXITY
// ==============================

// 1.1: Count READ operations for each Goal
MATCH (j:Goal)-[r:READS]->(d:Data)
WITH j, COUNT(r) AS read_count
SET j.read_count = read_count
RETURN j.name AS Goal, read_count AS ReadOperations
ORDER BY read_count DESC;

// 1.2: Count UPDATE operations for each Goal
MATCH (j:Goal)-[u:UPDATES]->(d:Data)
WITH j, COUNT(u) AS update_count
SET j.update_count = update_count
RETURN j.name AS Goal, update_count AS UpdateOperations
ORDER BY update_count DESC;

// 1.3: Count WRITE operations for each Goal
MATCH (j:Goal)-[w:WRITES]->(d:Data)
WITH j, COUNT(w) AS write_count
SET j.write_count = write_count
RETURN j.name AS Goal, write_count AS WriteOperations
ORDER BY write_count DESC;

// 1.4: Calculate Goal base complexity (weighted operation counts)
MATCH (j:Goal)
WITH j,
     COALESCE(j.read_count, 0) * 1 AS read_complexity,    // READ = 1
     COALESCE(j.update_count, 0) * 3 AS update_complexity, // UPDATE = 3
     COALESCE(j.write_count, 0) * 5 AS write_complexity    // WRITE = 5
WITH j, (read_complexity + update_complexity + write_complexity) AS base_complexity
SET j.base_complexity = base_complexity
RETURN j.name AS Goal, base_complexity AS BaseComplexity
ORDER BY base_complexity DESC;

// 1.5: Count users for each Goal
MATCH (u)-[d:DOES]->(j:Goal)
WITH j, COUNT(DISTINCT u) AS user_count
SET j.user_count = user_count
RETURN j.name AS Goal, user_count AS UserCount
ORDER BY user_count DESC;

// 1.6: Calculate final Goal complexity (base * user count)
MATCH (j:Goal)
WITH j, COALESCE(j.base_complexity, 0) * COALESCE(j.user_count, 1) AS complexity
SET j.complexity = complexity
RETURN j.name AS Goal, j.base_complexity AS BaseComplexity, j.user_count AS UserCount, complexity AS TotalComplexity
ORDER BY complexity DESC;

// PART 2: CALCULATE DATA NODE COMPLEXITY
// ==================================

// 2.1: Count read access for each Data node (for reference)
MATCH (d:Data)<-[r:READS]-() 
WITH d, COUNT(r) AS access_count
SET d.access_count = access_count
RETURN d.name AS Data, access_count AS AccessCount
ORDER BY access_count DESC;

// 2.2: Set base complexity for all Data nodes
MATCH (d:Data)
SET d.base_complexity = 10  // Base cost = 10
RETURN d.name AS Data, d.base_complexity AS BaseComplexity;

// 2.3: Apply TOIL_FACTOR to Data nodes
MATCH (d:Data)
WITH d, d.base_complexity * 1.8 AS complexity_with_toil
SET d.complexity = complexity_with_toil
RETURN d.name AS Data, d.base_complexity AS BaseComplexity, d.complexity AS ComplexityWithToil
ORDER BY d.complexity DESC;

// PART 3: DETAILED REPORTS
// ======================

// 3.1: Detailed Goal complexity breakdown
MATCH (j:Goal)
RETURN 
    j.name AS Goal,
    COALESCE(j.read_count, 0) AS ReadOps,
    COALESCE(j.update_count, 0) AS UpdateOps,
    COALESCE(j.write_count, 0) AS WriteOps,
    j.base_complexity AS BaseComplexity,
    j.user_count AS UserCount,
    j.complexity AS TotalComplexity
ORDER BY j.complexity DESC;

// 3.2: Detailed Data node complexity
MATCH (d:Data)
RETURN 
    d.name AS Data,
    COALESCE(d.access_count, 0) AS AccessCount,
    d.base_complexity AS BaseComplexity,
    d.complexity AS ComplexityWithToil
ORDER BY d.complexity DESC;

// PART 4: SUMMARY STATISTICS
// ========================

// 4.1: Goal summary
MATCH (j:Goal)
RETURN 
    COUNT(j) AS TotalGoals,
    SUM(j.complexity) AS TotalGoalComplexity,
    AVG(j.complexity) AS AvgGoalComplexity,
    MIN(j.complexity) AS MinGoalComplexity,
    MAX(j.complexity) AS MaxGoalComplexity;

// 4.2: Data node summary
MATCH (d:Data)
RETURN 
    COUNT(d) AS TotalDataNodes,
    SUM(d.complexity) AS TotalDataNodeComplexity,
    AVG(d.complexity) AS AvgDataNodeComplexity;

// 4.3: Total system complexity
MATCH (j:Goal)
WITH SUM(j.complexity) AS Goal_complexity
MATCH (d:Data)
WITH Goal_complexity, SUM(d.complexity) AS data_complexity
RETURN 
    Goal_complexity AS TotalGoalComplexity,
    data_complexity AS TotalDataComplexity,
    Goal_complexity + data_complexity AS TotalSystemComplexity;

// 4.4: Complexity distribution (for visualization)
MATCH (j:Goal)
RETURN j.name AS Component, j.complexity AS Complexity, 'Goal' AS Type
UNION
MATCH (d:Data)
RETURN d.name AS Component, d.complexity AS Complexity, 'Data' AS Type
ORDER BY Complexity DESC;