/**
 * ERPlayback - Visualgo-inspired playback system
 * Allows step-by-step replay of diagram construction
 */

class ERPlayback {
  constructor(editor) {
    this.editor = editor;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentStep = 0;
    this.playbackSpeed = 1000; // ms between steps
    this.playbackTimer = null;
    this.savedActionLog = [];
  }
  
  /**
   * Start playback from the beginning
   */
  async play(speed = this.playbackSpeed) {
    if (this.isPlaying) {
      console.log('Already playing');
      return;
    }
    
    this.playbackSpeed = speed;
    this.isPlaying = true;
    this.isPaused = false;
    
    // Save current action log and clear the editor
    this.savedActionLog = this.editor.getActionLog();
    this.editor.clear();
    this.currentStep = 0;
    
    // Emit playback start event
    this.emitEvent('playback-start', { totalSteps: this.savedActionLog.length });
    
    // Start playback loop
    await this.playLoop();
  }
  
  async playLoop() {
    while (this.isPlaying && this.currentStep < this.savedActionLog.length) {
      if (!this.isPaused) {
        await this.stepForward();
        await this.sleep(this.playbackSpeed);
      } else {
        await this.sleep(100); // Check pause state frequently
      }
    }
    
    if (this.currentStep >= this.savedActionLog.length) {
      this.stop();
    }
  }
  
  /**
   * Pause playback
   */
  pause() {
    if (!this.isPlaying) return;
    this.isPaused = true;
    this.emitEvent('playback-paused', { currentStep: this.currentStep });
  }
  
  /**
   * Resume playback
   */
  resume() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;
    this.emitEvent('playback-resumed', { currentStep: this.currentStep });
  }
  
  /**
   * Stop playback
   */
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = null;
    }
    
    this.emitEvent('playback-stopped', { 
      currentStep: this.currentStep,
      totalSteps: this.savedActionLog.length 
    });
  }
  
  /**
   * Step forward one action
   */
  async stepForward() {
    if (this.currentStep >= this.savedActionLog.length) {
      console.log('Reached end of action log');
      return false;
    }
    
    const action = this.savedActionLog[this.currentStep];
    await this.replayAction(action);
    this.currentStep++;
    
    this.emitEvent('playback-step', { 
      step: this.currentStep,
      total: this.savedActionLog.length,
      action 
    });
    
    return true;
  }
  
  /**
   * Step backward one action
   */
  async stepBackward() {
    if (this.currentStep <= 0) {
      console.log('Already at beginning');
      return false;
    }
    
    this.currentStep--;
    
    // Rebuild diagram up to current step
    await this.goToStep(this.currentStep);
    
    this.emitEvent('playback-step-back', { 
      step: this.currentStep,
      total: this.savedActionLog.length 
    });
    
    return true;
  }
  
  /**
   * Go to specific step
   */
  async goToStep(stepNumber) {
    if (stepNumber < 0 || stepNumber > this.savedActionLog.length) {
      console.error('Invalid step number');
      return;
    }
    
    // Clear and rebuild from scratch
    this.editor.clear();
    this.currentStep = 0;
    
    // Replay actions up to target step
    while (this.currentStep < stepNumber) {
      const action = this.savedActionLog[this.currentStep];
      await this.replayAction(action, false); // Don't animate
      this.currentStep++;
    }
    
    this.emitEvent('playback-goto', { 
      step: this.currentStep,
      total: this.savedActionLog.length 
    });
  }
  
  /**
   * Replay a single action
   */
  async replayAction(action, animate = true) {
    const model = this.editor.graph.getModel();
    
    if (animate) {
      // Highlight the action being replayed
      this.highlightAction(action);
    }
    
    switch (action.type) {
      case 'ADD_ENTITY':
        this.editor.addEntity(action.name, action.x, action.y);
        break;
        
      case 'ADD_ATTRIBUTE':
        const entityCell = this.findCellById(action.entityId);
        if (entityCell) {
          this.editor.addAttribute(entityCell, action.name, action.isPrimaryKey);
        }
        break;
        
      case 'ADD_RELATIONSHIP':
        const sourceCell = this.findCellById(action.sourceId);
        const targetCell = this.findCellById(action.targetId);
        if (sourceCell && targetCell) {
          this.editor.addRelationship(sourceCell, targetCell, action.cardinality, action.name);
        }
        break;
        
      case 'MARK_PRIMARY_KEY':
        const attrCell = this.findCellById(action.cellId);
        if (attrCell) {
          this.editor.markAsPrimaryKey(attrCell);
        }
        break;
        
      case 'LABEL_CHANGED':
        const cell = this.findCellById(action.cellId);
        if (cell) {
          model.beginUpdate();
          try {
            model.setValue(cell, action.newValue);
          } finally {
            model.endUpdate();
          }
        }
        break;
        
      case 'CELL_MOVED':
        const movedCell = this.findCellById(action.cellId);
        if (movedCell && movedCell.geometry) {
          model.beginUpdate();
          try {
            const geo = movedCell.geometry.clone();
            geo.x = action.x;
            geo.y = action.y;
            model.setGeometry(movedCell, geo);
          } finally {
            model.endUpdate();
          }
        }
        break;
        
      default:
        console.warn('Unknown action type:', action.type);
    }
  }
  
  /**
   * Find cell by ID in current graph
   */
  findCellById(cellId) {
    const model = this.editor.graph.getModel();
    return model.getCell(cellId);
  }
  
  /**
   * Highlight action being replayed (visual feedback)
   */
  highlightAction(action) {
    // Create temporary visual highlight
    const cell = this.findCellById(action.cellId);
    if (cell) {
      const state = this.editor.graph.view.getState(cell);
      if (state) {
        // Flash the cell
        const originalStyle = cell.style;
        this.editor.graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, 4, [cell]);
        
        setTimeout(() => {
          this.editor.graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, 2, [cell]);
        }, 300);
      }
    }
  }
  
  /**
   * Set playback speed
   */
  setSpeed(speed) {
    this.playbackSpeed = speed;
  }
  
  /**
   * Get current playback state
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentStep: this.currentStep,
      totalSteps: this.savedActionLog.length,
      speed: this.playbackSpeed
    };
  }
  
  /**
   * Reset to beginning without clearing log
   */
  reset() {
    this.stop();
    this.currentStep = 0;
    this.editor.clear();
    this.emitEvent('playback-reset');
  }
  
  /**
   * Helper to sleep/delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Emit custom events
   */
  emitEvent(eventName, detail = {}) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
  window.ERPlayback = ERPlayback;
}
