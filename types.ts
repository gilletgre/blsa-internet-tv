export interface OrderForm {
  // Product
  pack: string;
  tvOption: string;
  wifi: string;
  installExpress: boolean;
  
  // Address
  street: string;
  complement: string;
  zip: string;
  city: string;
  date: string;
  slot: string;

  // Client
  clientId: string;
  clientName: string;   // Company Name
  contactName: string;  // Person Name
  clientEmail: string;
  clientPhone: string;

  // Billing
  convention: string;
  poRef: string;
  notes: string;
}

export const INITIAL_DATA: OrderForm = {
  pack: "Pack Flex+ (Internet + TV)",
  tvOption: "Aucune", // Default, hidden from UI
  wifi: "Non",       // Default, hidden from UI
  installExpress: false,
  street: "",
  complement: "",
  zip: "",
  city: "",
  date: "",
  slot: "Non précisé",
  clientId: "CDBID : 624841897",
  clientName: "BRUSSELS LUXURY SERVICED APARTMENTS",
  contactName: "Sophie DUCOBU",
  clientEmail: "sophie.ducobu@gmail.com",
  clientPhone: "0496283708",
  convention: "PA 1",
  poRef: "",
  notes: ""
};

export type WizardStep = {
  id: string;
  title: string;
  description: string;
  fields: (keyof OrderForm)[];
};

export const STEPS: WizardStep[] = [
  {
    id: 'product',
    title: 'Produit',
    description: 'Sélection du pack et de l\'installation.',
    fields: ['pack', 'installExpress']
  },
  {
    id: 'address',
    title: 'Localisation',
    description: 'Adresse de raccordement et rendez-vous.',
    fields: ['street', 'complement', 'zip', 'city', 'date', 'slot']
  },
  {
    id: 'client',
    title: 'Client',
    description: 'Vérification des coordonnées.',
    fields: ['clientId', 'clientName', 'contactName', 'clientEmail', 'clientPhone']
  },
  {
    id: 'billing',
    title: 'Validation',
    description: 'Facturation et notes finales.',
    fields: ['convention', 'poRef', 'notes']
  }
];