'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Loads Google Translate Element and auto-triggers translation
 * based on the saved language in localStorage ('saarthi_user_language').
 * 
 * Hides the default Google Translate toolbar — our onboarding language
 * selector is the user-facing control.
 */
export default function GoogleTranslate() {
  const pathname = usePathname();

  useEffect(() => {
    // Remove any notranslate meta tag that blocks Google Translate from translating page text
    const existingMeta = document.querySelector('meta[name="google"][content="notranslate"]');
    if (existingMeta) {
      existingMeta.remove();
    }

    const savedLang = localStorage.getItem('saarthi_user_language');
    if (!savedLang || savedLang === 'en') return;

    // Ensure googtrans cookie is active
    document.cookie = `googtrans=/en/${savedLang}; path=/;`;
    if (window.location.hostname && window.location.hostname !== 'localhost') {
      document.cookie = `googtrans=/en/${savedLang}; domain=.${window.location.hostname}; path=/;`;
    }

    const triggerTranslate = () => {
      const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (sel) {
        if (sel.value !== savedLang) {
          sel.value = savedLang;
          sel.dispatchEvent(new Event('change'));
        }
      }
    };

    // Prevent double-init script loading
    if (!(window as any).google || !(window as any).google.translate) {
      if (!document.getElementById('google-translate-script')) {
        (window as any).googleTranslateElementInit = () => {
          try {
            new (window as any).google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'te,hi,ta',
                autoDisplay: false,
              },
              'google_translate_element'
            );
          } catch {
            // Guard
          }

          const poll = setInterval(() => {
            const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
            if (sel) {
              sel.value = savedLang;
              sel.dispatchEvent(new Event('change'));
              clearInterval(poll);
            }
          }, 150);

          setTimeout(() => clearInterval(poll), 6000);
        };

        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    } else {
      triggerTranslate();
    }

    const interval = setInterval(triggerTranslate, 1000);
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <>
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_element" style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} />

      {/* Hide Google Translate toolbar and banner */}
      <style>{`
        .goog-te-banner-frame, .skiptranslate, #goog-gt-tt,
        .goog-te-balloon-frame, .goog-tooltip {
          display: none !important;
        }
        body { top: 0 !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
      `}</style>
    </>
  );
}
