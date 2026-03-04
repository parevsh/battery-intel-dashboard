export const COMPANY_NAMES: Record<string, string[]> = {
  "Tesla": ["tesla"],
  "CATL": ["catl", "contemporary amperex"],
  "BYD": ["byd"],
  "LG Energy Solution": ["lg energy", "lg chem", "lges"],
  "Panasonic": ["panasonic"],
  "Samsung SDI": ["samsung sdi"],
  "SK On": ["sk on", "sk innovation"],
  "Northvolt": ["northvolt"],
  "QuantumScape": ["quantumscape"],
  "Rivian": ["rivian"],
  "Lucid": ["lucid motors", "lucid group"],
  "Solid Power": ["solid power"],
  "FREYR Battery": ["freyr"],
  "Ola Electric": ["ola electric"],
  "Ather Energy": ["ather energy", "ather"],
  "Tata Motors": ["tata motors", "tata ev"],
  "Mahindra": ["mahindra electric", "mahindra ev"],
  "Reliance": ["reliance new energy", "reliance industries"],
  "Amara Raja": ["amara raja"],
  "Exide": ["exide energy", "exide industries"],
  "ACC Limited": ["acc limited", "acc battery"],
  "CALB": ["calb"],
  "EVE Energy": ["eve energy"],
  "Gotion": ["gotion"],
  "Envision AESC": ["envision aesc", "envision"],
  "SES AI": ["ses ai"],
  "EnerSys": ["enersys"],
  "Fluence": ["fluence energy", "fluence"],
  "Tesla Energy": ["tesla energy", "megapack", "powerwall"],
  "BMW": ["bmw"],
  "Volkswagen": ["volkswagen", "vw"],
  "Mercedes-Benz": ["mercedes-benz", "mercedes"],
  "Hyundai": ["hyundai motor", "hyundai ev"],
  "Toyota": ["toyota"],
  "Ford": ["ford motor", "ford ev"],
  "GM": ["general motors"],
  "Stellantis": ["stellantis"],
  "NIO": ["nio"],
  "XPeng": ["xpeng"],
  "Li Auto": ["li auto"],
}

export function extractCompanies(text: string): string[] {
  const lower = text.toLowerCase()
  const found: string[] = []

  for (const [company, aliases] of Object.entries(COMPANY_NAMES)) {
    for (const alias of aliases) {
      if (lower.includes(alias)) {
        found.push(company)
        break
      }
    }
  }

  return found
}
