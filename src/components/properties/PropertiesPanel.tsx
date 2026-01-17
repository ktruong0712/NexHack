import React, { useState } from 'react';
import { useDiagramStore } from '@/store/diagramStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Key } from 'lucide-react';
import { AttributeType, Cardinality, Participation } from '@/types/diagram';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const PropertiesPanel: React.FC = () => {
  const {
    diagram,
    selectedEntityId,
    selectedRelationshipId,
    updateEntity,
    deleteEntity,
    addAttribute,
    updateAttribute,
    deleteAttribute,
    updateRelationship,
    deleteRelationship,
  } = useDiagramStore();

  const [newAttrName, setNewAttrName] = useState('');

  const selectedEntity = selectedEntityId
    ? diagram.entities.find((e) => e.id === selectedEntityId)
    : null;

  const selectedRelationship = selectedRelationshipId
    ? diagram.relationships.find((r) => r.id === selectedRelationshipId)
    : null;

  const handleAddAttribute = () => {
    if (!selectedEntityId || !newAttrName.trim()) return;
    addAttribute(selectedEntityId, {
      id: generateId(),
      name: newAttrName.trim(),
      type: 'simple',
      dataType: 'VARCHAR(255)',
    });
    setNewAttrName('');
  };

  if (!selectedEntity && !selectedRelationship) {
    return (
      <div className="h-full flex flex-col bg-card border-l border-border">
        <div className="panel-header">Properties</div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
          Select an entity or relationship to view and edit its properties
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="panel-header flex items-center justify-between">
        <span>Properties</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-destructive hover:text-destructive"
          onClick={() => {
            if (selectedEntity) deleteEntity(selectedEntity.id);
            if (selectedRelationship) deleteRelationship(selectedRelationship.id);
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Entity Properties */}
          {selectedEntity && (
            <>
              <div className="space-y-2">
                <Label className="text-xs">Entity Name</Label>
                <Input
                  value={selectedEntity.name}
                  onChange={(e) => updateEntity(selectedEntity.id, { name: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Entity Type</Label>
                <Select
                  value={selectedEntity.type}
                  onValueChange={(v) => updateEntity(selectedEntity.id, { type: v as any })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strong">Strong Entity</SelectItem>
                    <SelectItem value="weak">Weak Entity</SelectItem>
                    <SelectItem value="associative">Associative Entity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Attributes */}
              <div className="space-y-2">
                <Label className="text-xs">Attributes</Label>
                
                {/* Add new attribute */}
                <div className="flex gap-2">
                  <Input
                    value={newAttrName}
                    onChange={(e) => setNewAttrName(e.target.value)}
                    placeholder="Attribute name"
                    className="h-8 text-sm flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddAttribute()}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddAttribute}
                    className="h-8"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Attribute list */}
                <div className="space-y-2 mt-2">
                  {selectedEntity.attributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex items-center gap-2 p-2 rounded bg-muted/50"
                    >
                      <Input
                        value={attr.name}
                        onChange={(e) =>
                          updateAttribute(selectedEntity.id, attr.id, { name: e.target.value })
                        }
                        className="h-7 text-xs flex-1"
                      />
                      <Select
                        value={attr.type}
                        onValueChange={(v) =>
                          updateAttribute(selectedEntity.id, attr.id, { type: v as AttributeType })
                        }
                      >
                        <SelectTrigger className="h-7 w-24 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="key">Key (PK)</SelectItem>
                          <SelectItem value="partial-key">Partial Key</SelectItem>
                          <SelectItem value="composite">Composite</SelectItem>
                          <SelectItem value="multivalued">Multivalued</SelectItem>
                          <SelectItem value="derived">Derived</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAttribute(selectedEntity.id, attr.id)}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {selectedEntity.attributes.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No attributes yet
                  </p>
                )}
              </div>
            </>
          )}

          {/* Relationship Properties */}
          {selectedRelationship && (
            <>
              <div className="space-y-2">
                <Label className="text-xs">Relationship Name</Label>
                <Input
                  value={selectedRelationship.name}
                  onChange={(e) => updateRelationship(selectedRelationship.id, { name: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Relationship Type</Label>
                <Select
                  value={selectedRelationship.type}
                  onValueChange={(v) => updateRelationship(selectedRelationship.id, { type: v as any })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relationship">Relationship</SelectItem>
                    <SelectItem value="identifying">Identifying</SelectItem>
                    <SelectItem value="unary">Unary</SelectItem>
                    <SelectItem value="binary">Binary</SelectItem>
                    <SelectItem value="ternary">Ternary</SelectItem>
                    <SelectItem value="n-ary">N-ary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Connections */}
              <div className="space-y-2">
                <Label className="text-xs">Connections</Label>
                {selectedRelationship.connections.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No connections yet. Use the Connect tool to link entities.
                  </p>
                ) : (
                  selectedRelationship.connections.map((conn, idx) => {
                    const entity = diagram.entities.find((e) => e.id === conn.entityId);
                    return (
                      <div
                        key={`${conn.entityId}-${idx}`}
                        className="p-2 rounded bg-muted/50 space-y-2"
                      >
                        <p className="text-xs font-medium">
                          {entity?.name || 'Unknown Entity'}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={conn.cardinality}
                            onValueChange={(v) => {
                              const newConnections = [...selectedRelationship.connections];
                              newConnections[idx] = { ...conn, cardinality: v as Cardinality };
                              updateRelationship(selectedRelationship.id, { connections: newConnections });
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue placeholder="Cardinality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="one">One (1)</SelectItem>
                              <SelectItem value="many">Many (N)</SelectItem>
                              <SelectItem value="zero-or-one">Zero or One (0..1)</SelectItem>
                              <SelectItem value="one-and-only-one">One and Only One (1..1)</SelectItem>
                              <SelectItem value="zero-or-many">Zero or Many (0..*)</SelectItem>
                              <SelectItem value="one-or-many">One or Many (1..*)</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={conn.participation}
                            onValueChange={(v) => {
                              const newConnections = [...selectedRelationship.connections];
                              newConnections[idx] = { ...conn, participation: v as Participation };
                              updateRelationship(selectedRelationship.id, { connections: newConnections });
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue placeholder="Participation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="total">Total</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
