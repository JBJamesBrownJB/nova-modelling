// ============================================================================
// SIMULATION CONFIGURATION
// ============================================================================
// Adjust these values to control the physics and behavior of the graph
import { ICONS } from '../../../styles/icons';
import { COLORS } from '../../../styles/colors';

const getServiceColor = (status) => {
    switch (status) {
        case 'in_development':
            return COLORS.STATUS_IN_DEVELOPMENT;
        case 'vapour':
            return COLORS.STATUS_VAPOUR;
        case 'active':
            return COLORS.STATUS_ACTIVE;
        default:
            return COLORS.STATUS_VAPOUR;
    }
};

const SIMULATION_CONFIG = {
    // Base force parameters
    forces: {
        // Link forces - control how nodes are connected by links
        link: {
            strength: 0.8,                // Base link strength (0-1), higher = more rigid connections
            selectedMultiplier: 1.9,      // Multiplier for links connected to selected nodes
            distance: {
                selected: 2.8                 // Link distance multiplier for selected connections
            }
        },

        // Charge forces - control node repulsion/attraction
        charge: {
            strength: -400,              // Base repulsion strength, negative = repel
            selectedMultiplier: 2.5,      // Multiplier for selected nodes
            connectedMultiplier: 1.2,     // Multiplier for nodes connected to selected
            contextMultiplier: 0.5        // Multiplier for background nodes
        },

        // Collision detection - prevents nodes from overlapping
        collision: {
            radiusMultiplier: 1.2,       // How much extra space around nodes
            strength: 0.8                // How strongly to enforce collision (0-1)
        },

        // Positioning forces - keep graph centered or control expansion
        positioning: {
            strength: 0.07,              // Base positioning force strength
            minStrength: 0.005           // Minimal strength for selected mode
        }
    },

    // Simulation behavior
    simulation: {
        alphaDecay: 0.03,             // How quickly simulation cools down (higher = faster stabilization)
        alphaTarget: 0,                // Target cooling value (0 = complete stop)
        restartStrength: 0.1,          // Alpha value when restarting simulation
        nodeFixedDamping: 0.0,         // How strongly fixed nodes resist movement
        velocityDecay: 0.4,           // How quickly node velocity decays (lower = faster movement)
        initialStabilizationSpeed: 0.012, // Initial alpha for faster initial layout (0-1)
        fastCooling: {                // Fast cooling parameters for quick stabilization
            velocityDecay: 0.2,         // Lower value = faster movement during fast cooling
            alphaDecay: 0.06,           // Higher value = faster cooling
            iterations: 100             // Number of rapid iterations to run
        }
    },

    // Timing configuration
    timing: {
        restartDelay: 500,            // Delay before simulation restarts after selection (ms)
        stabilizationDelay: 300,      // Delay before initial stabilization starts (ms)
        dragInitiationDelay: 100      // Delay before deciding if it's a drag operation (ms)
    }
};

// Legacy constants - maintained for compatibility
const NODE_CONSTANTS = {
    BASE_RADIUS: 20,
    GOAL_HIT_AREA_MULTIPLIER: 1.25,
    USER_HIT_AREA_MULTIPLIER: 0.2,
    SERVICE_HIT_AREA_MULTIPLIER: 0.5,
    LABEL_TRUNCATE_LENGTH: 20
};

const LINK_CONSTANTS = {
    DOES: '#ECB5C9',   // Pink
    DEPENDS_ON: '#F16667'  // Red
};

// Configuration objects for different node types
const goalNodeConfig = {
    nodeType: 'Goal',
    filter: d => d.label === 'Goal',
    hitAreaShape: 'circle',
    hitAreaMultiplier: NODE_CONSTANTS.GOAL_HIT_AREA_MULTIPLIER,
    nodeShape: 'circle',
    getNodeFill: d => d.npsColor
};

const userNodeConfig = {
    nodeType: 'User',
    filter: d => d.label === 'User',
    hitAreaShape: 'circle',
    hitAreaMultiplier: NODE_CONSTANTS.USER_HIT_AREA_MULTIPLIER,
    nodeShape: 'path',
    icon: ICONS.USER,
    getNodeFill: d => d.npsScore ? d.npsColor : COLORS.NODE_USER_DEFAULT
};

const serviceNodeConfig = {
    nodeType: 'Service',
    filter: d => d.label === 'Service',
    hitAreaShape: 'rect',
    hitAreaMultiplier: NODE_CONSTANTS.SERVICE_HIT_AREA_MULTIPLIER,
    nodeShape: 'path',
    icon: ICONS.SERVICE,
    getNodeFill: d => getServiceColor(d.status),
    extraIconCondition: d => d.status === 'in_development',
    extraIconClass: 'planning-icon',
    extraIcon: ICONS.PLANNING,
    extraIconFill: 'none',
    extraIconStroke: COLORS.STATUS_IN_DEVELOPMENT_ICON,
    extraIconStrokeWidth: '2',
    extraIconStrokeLinecap: 'round',
    extraIconStrokeLinejoin: 'round',
    extraIconTransform: 'translate(-20.1, 3) scale(0.4)'
};

export { SIMULATION_CONFIG, NODE_CONSTANTS, LINK_CONSTANTS, goalNodeConfig, userNodeConfig, serviceNodeConfig };