import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext({ locale: "en", setLocale: () => {}, t: (k) => k });

const dict = {
  en: {
    lang: "EN",
    home: "home",
    about: "about",
    services: "services",
    work: "work",
    testimonials: "testimonials",
    contact: "contact",
    years_of_experience: "Years of experience.",
    satisfied_clients: "Satisfied clients.",
    finished_projects: "Finished projects.",
    winning_awards: "Winning awards.",
    contact_title_prefix: "Let's",
    contact_title_accent: "connect.",
    name: "Name",
    email: "E-mail",
    subject: "Subject",
    message: "Message...",
    lets_talk: "Let's talk",
    thanks_message: "Thank you. I will get back to you ASAP.",
    failed_send: "Failed to send message",
  },
  fa: {
    lang: "فا",
    home: "خانه",
    about: "درباره",
    services: "خدمات",
    work: "نمونه‌کار",
    testimonials: "نظرات",
    contact: "تماس",
    years_of_experience: "سال سابقه.",
    satisfied_clients: "مشتری راضی.",
    finished_projects: "پروژه انجام‌شده.",
    winning_awards: "جایزه کسب‌شده.",
    contact_title_prefix: "بیایید",
    contact_title_accent: "ارتباط بگیریم.",
    name: "نام",
    email: "ایمیل",
    subject: "موضوع",
    message: "پیام...",
    lets_talk: "ارسال پیام",
    thanks_message: "ممنون. به‌زودی با شما تماس می‌گیرم.",
    failed_send: "ارسال پیام ناموفق بود",
  },
};

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState("en");
  const value = useMemo(() => ({ locale, setLocale, t: (k) => dict[locale]?.[k] || dict.en[k] || k }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
