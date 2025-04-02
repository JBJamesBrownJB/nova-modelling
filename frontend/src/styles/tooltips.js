// tooltips.js
export const tooltipStyles = `
  .tooltip {
    position: absolute;
    padding: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 4px;
    pointer-events: none;
    z-index: 1000;
  }

  .demand-level {
    font-weight: bold;
  }

  .demand-High {
    color: #ff4d4d;
  }

  .demand-Medium {
    color: #ffa64d;
  }

  .demand-Low {
    color: #ffff4d;
  }

  .demand-none {
    color: #cccccc;
  }

  .demand-unknown {
    color: #808080;
  }
`;