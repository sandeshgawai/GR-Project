import { usePrefs } from "./prefs";

type Lang = "en" | "mr";

// Translation dictionary. Keys are stable identifiers; each maps to an
// English + Marathi string. Add entries here to translate more of the UI.
const DICT: Record<string, { en: string; mr: string }> = {
  // Sidebar / nav
  "nav.dashboard": { en: "Dashboard", mr: "डॅशबोर्ड" },
  "nav.repository": { en: "GR Repository", mr: "जीआर संग्रह" },
  "nav.search": { en: "Search GR", mr: "जीआर शोधा" },
  "nav.add": { en: "Add New GR", mr: "नवीन जीआर जोडा" },
  "nav.import": { en: "Import Excel", mr: "एक्सेल आयात करा" },
  "nav.departments": { en: "Departments", mr: "विभाग" },
  "nav.reports": { en: "Reports", mr: "अहवाल" },
  "nav.settings": { en: "Settings", mr: "सेटिंग्ज" },
  "brand.tagline": { en: "Resolution Repository", mr: "शासन निर्णय संग्रह" },
  "user.role": { en: "Administrator", mr: "प्रशासक" },
  "action.logout": { en: "Logout", mr: "बाहेर पडा" },

  // Top bar
  "topbar.search": { en: "Quick search…", mr: "जलद शोध…" },

  // Dashboard
  "dash.greeting": { en: "Good Morning, Admin", mr: "सुप्रभात, प्रशासक" },
  "dash.subtitle": {
    en: "Government Resolution Management Dashboard",
    mr: "शासन निर्णय व्यवस्थापन डॅशबोर्ड",
  },
  "dash.totalGrs": { en: "Total GRs", mr: "एकूण जीआर" },
  "dash.currentYear": { en: "Current Year GRs", mr: "चालू वर्षाचे जीआर" },
  "dash.departments": { en: "Departments", mr: "विभाग" },
  "dash.importantGrs": { en: "Important GRs", mr: "महत्त्वाचे जीआर" },

  // Settings
  "settings.title": { en: "Settings", mr: "सेटिंग्ज" },
  "settings.subtitle": {
    en: "Manage your profile, credentials and application preferences.",
    mr: "तुमचे प्रोफाइल, क्रेडेन्शियल्स आणि अ‍ॅप्लिकेशन प्राधान्ये व्यवस्थापित करा.",
  },
  "settings.profile": { en: "Profile", mr: "प्रोफाइल" },
  "settings.changePassword": { en: "Change Password", mr: "पासवर्ड बदला" },
  "settings.preferences": {
    en: "Application Preferences",
    mr: "अ‍ॅप्लिकेशन प्राधान्ये",
  },
  "settings.language": { en: "Language", mr: "भाषा" },
  "settings.theme": { en: "Theme Preference", mr: "थीम प्राधान्य" },
  "settings.fullName": { en: "Full Name", mr: "पूर्ण नाव" },
  "settings.designation": { en: "Designation", mr: "पदनाम" },
  "settings.email": { en: "Email", mr: "ईमेल" },
  "settings.office": { en: "Office", mr: "कार्यालय" },
  "settings.saveProfile": { en: "Save Profile", mr: "प्रोफाइल जतन करा" },
  "settings.currentPassword": { en: "Current Password", mr: "सध्याचा पासवर्ड" },
  "settings.newPassword": { en: "New Password", mr: "नवीन पासवर्ड" },
  "settings.confirmPassword": {
    en: "Confirm New Password",
    mr: "नवीन पासवर्डची पुष्टी करा",
  },
  "settings.updatePassword": { en: "Update Password", mr: "पासवर्ड अद्यतनित करा" },
  "settings.emailNotifications": {
    en: "Email notifications",
    mr: "ईमेल सूचना",
  },
  "settings.compactTables": { en: "Compact tables", mr: "संक्षिप्त सारण्या" },
  "settings.savePreferences": {
    en: "Save Preferences",
    mr: "प्राधान्ये जतन करा",
  },
};

export function useT() {
  const { prefs } = usePrefs();
  const lang: Lang = prefs.lang === "Marathi" ? "mr" : "en";
  return (key: string, fallback?: string): string => {
    const entry = DICT[key];
    if (!entry) return fallback ?? key;
    return entry[lang] || entry.en;
  };
}
