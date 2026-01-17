import React from 'react';

// Chen Notation Symbols

export const StrongEntitySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 32" className={className} fill="none">
    <rect x="2" y="2" width="44" height="28" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const WeakEntitySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 32" className={className} fill="none">
    <rect x="4" y="4" width="40" height="24" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="2" y="2" width="44" height="28" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const AssociativeEntitySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 32" className={className} fill="none">
    <rect x="2" y="2" width="44" height="28" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <polygon points="24,6 42,16 24,26 6,16" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

export const SimpleAttributeSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 24" className={className} fill="none">
    <ellipse cx="16" cy="12" rx="14" ry="10" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const CompositeAttributeSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 32" className={className} fill="none">
    <ellipse cx="20" cy="10" rx="12" ry="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <ellipse cx="10" cy="24" rx="8" ry="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <ellipse cx="30" cy="24" rx="8" ry="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <line x1="14" y1="16" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="26" y1="16" x2="30" y2="20" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const MultivaluedAttributeSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 24" className={className} fill="none">
    <ellipse cx="16" cy="12" rx="14" ry="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <ellipse cx="16" cy="12" rx="11" ry="7" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const DerivedAttributeSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 24" className={className} fill="none">
    <ellipse cx="16" cy="12" rx="14" ry="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" fill="none" />
  </svg>
);

export const KeyAttributeSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 24" className={className} fill="none">
    <ellipse cx="16" cy="12" rx="14" ry="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="6" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const PartialKeySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 24" className={className} fill="none">
    <ellipse cx="16" cy="12" rx="14" ry="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="6" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
  </svg>
);

export const RelationshipSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 32" className={className} fill="none">
    <polygon points="20,2 38,16 20,30 2,16" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const IdentifyingRelationshipSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 32" className={className} fill="none">
    <polygon points="20,4 36,16 20,28 4,16" stroke="currentColor" strokeWidth="2" fill="none" />
    <polygon points="20,2 38,16 20,30 2,16" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const SupertypeSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 40" className={className} fill="none">
    <rect x="2" y="2" width="44" height="20" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="24" cy="32" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="24" y1="22" x2="24" y2="26" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const SubtypeSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 40" className={className} fill="none">
    <circle cx="24" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="24" y1="14" x2="24" y2="18" stroke="currentColor" strokeWidth="2" />
    <rect x="2" y="18" width="44" height="20" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const ISASymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 24" className={className} fill="none">
    <circle cx="16" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <text x="16" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">ISA</text>
  </svg>
);

export const DisjointSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 24" className={className} fill="none">
    <circle cx="16" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <text x="16" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">d</text>
  </svg>
);

export const OverlappingSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 24" className={className} fill="none">
    <circle cx="16" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <text x="16" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">o</text>
  </svg>
);

export const CategorySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 24" className={className} fill="none">
    <circle cx="16" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <text x="16" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">∪</text>
  </svg>
);

export const AggregationSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 36" className={className} fill="none">
    <rect x="2" y="2" width="44" height="32" rx="1" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" fill="none" />
    <polygon points="24,10 32,18 24,26 16,18" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

// Participation symbols
export const TotalParticipationSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 16" className={className} fill="none">
    <line x1="2" y1="8" x2="30" y2="8" stroke="currentColor" strokeWidth="3" />
    <line x1="2" y1="4" x2="2" y2="12" stroke="currentColor" strokeWidth="3" />
    <line x1="30" y1="4" x2="30" y2="12" stroke="currentColor" strokeWidth="3" />
  </svg>
);

export const PartialParticipationSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 16" className={className} fill="none">
    <line x1="2" y1="8" x2="30" y2="8" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Cardinality symbols
export const OneCardinalitySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 16" className={className} fill="none">
    <text x="12" y="12" textAnchor="middle" fontSize="12" fill="currentColor" fontWeight="bold">1</text>
  </svg>
);

export const ManyCardinalitySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 16" className={className} fill="none">
    <text x="12" y="12" textAnchor="middle" fontSize="12" fill="currentColor" fontWeight="bold">N</text>
  </svg>
);

export const MinMaxSymbol: React.FC<{ className?: string; min?: string; max?: string }> = ({ 
  className, 
  min = "0", 
  max = "N" 
}) => (
  <svg viewBox="0 0 40 16" className={className} fill="none">
    <text x="20" y="12" textAnchor="middle" fontSize="10" fill="currentColor">({min},{max})</text>
  </svg>
);

// Crow's Foot Notation Symbols

export const CrowEntitySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 40" className={className} fill="none">
    <rect x="2" y="2" width="44" height="36" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="2" y1="12" x2="46" y2="12" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const CrowZeroSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none">
    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const CrowOneSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none">
    <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CrowManySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 16" className={className} fill="none">
    <line x1="4" y1="8" x2="20" y2="2" stroke="currentColor" strokeWidth="2" />
    <line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="2" />
    <line x1="4" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CrowZeroOrOneSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 16" className={className} fill="none">
    <circle cx="10" cy="8" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="20" y1="2" x2="20" y2="14" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CrowOneAndOnlyOneSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 16" className={className} fill="none">
    <line x1="10" y1="2" x2="10" y2="14" stroke="currentColor" strokeWidth="2" />
    <line x1="18" y1="2" x2="18" y2="14" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CrowZeroOrManySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 16" className={className} fill="none">
    <circle cx="10" cy="8" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="20" y1="8" x2="36" y2="2" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="8" x2="36" y2="8" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="8" x2="36" y2="14" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CrowOneOrManySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 16" className={className} fill="none">
    <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="2" />
    <line x1="18" y1="8" x2="34" y2="2" stroke="currentColor" strokeWidth="2" />
    <line x1="18" y1="8" x2="34" y2="8" stroke="currentColor" strokeWidth="2" />
    <line x1="18" y1="8" x2="34" y2="14" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CrowIdentifyingRelSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 16" className={className} fill="none">
    <line x1="4" y1="8" x2="44" y2="8" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CrowNonIdentifyingRelSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 16" className={className} fill="none">
    <line x1="4" y1="8" x2="44" y2="8" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
  </svg>
);

// Key symbols
export const PrimaryKeySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} fill="none">
    <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="10" y1="10" x2="10" y2="18" stroke="currentColor" strokeWidth="2" />
    <line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="2" />
    <line x1="10" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const ForeignKeySymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} fill="none">
    <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="2 1" />
    <line x1="10" y1="10" x2="10" y2="18" stroke="currentColor" strokeWidth="2" />
    <line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="2" />
  </svg>
);
