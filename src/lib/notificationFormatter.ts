import { getISTDateInfo } from '@/lib/istDate';

export interface SsdNotificationParams {
  status: 'issuing' | 'paused' | 'closed-for-day' | 'suspended';
  ssdStatus?: 'issuing' | 'paused' | 'completed' | 'suspended';
  ddStatus?: 'issuing' | 'paused' | 'completed' | 'suspended';
  ssdAvailable?: string | number;
  ddAvailable?: string | number;
  targetDarshanDate?: string;
  nextBatchTime?: string;
  customNotice?: string;
  language?: 'en' | 'te' | 'bilingual';
}

export interface FormattedNotification {
  title: string;
  body: string;
}

/**
 * Formats high-priority SSD & DD token push notifications with critical data front-loaded
 * so essential info (available counts, darshan date, status) is immediately visible in Android's collapsed drawer.
 */
export function formatSsdTokenNotification(params: SsdNotificationParams): FormattedNotification {
  const {
    status,
    ssdStatus,
    ddStatus,
    ssdAvailable = '0',
    ddAvailable = '0',
    targetDarshanDate,
    nextBatchTime = '',
    customNotice = '',
    language = 'en'
  } = params;

  // Compute canonical target darshan date in Asia/Kolkata if not provided
  let darshanDate = targetDarshanDate;
  if (!darshanDate) {
    const ist = getISTDateInfo();
    const isIssuing = status === 'issuing' || ssdStatus === 'issuing' || ddStatus === 'issuing';
    darshanDate = isIssuing ? ist.tomorrow : ist.today;
  }

  const isBothIssuing = (status === 'issuing') || (ssdStatus === 'issuing' && ddStatus === 'issuing');
  const isOnlySsdIssuing = ssdStatus === 'issuing' && ddStatus !== 'issuing';
  const isOnlyDdIssuing = ddStatus === 'issuing' && ssdStatus !== 'issuing';
  const isPaused = status === 'paused' || ssdStatus === 'paused' || ddStatus === 'paused';
  const isCompleted = status === 'closed-for-day' || (ssdStatus === 'completed' && ddStatus === 'completed');
  const isSuspended = status === 'suspended';

  // Format numbers cleanly
  const ssdCount = String(ssdAvailable).trim() || '0';
  const ddCount = String(ddAvailable).trim() || '0';
  const noticeClean = customNotice.trim();

  // 1. TELUGU PRESET
  if (language === 'te') {
    if (isCompleted) {
      return {
        title: "⚠️ నేటి ఎస్‌ఎస్‌డి & డిడి కోటా పూర్తయింది",
        body: `కోటా పూర్తయింది (SSD 10K / DD 2K). ${nextBatchTime ? `తదుపరి విడుదల: ${nextBatchTime}. ` : ''}సర్వదర్శనం తెరిచి ఉంది.`
      };
    }
    if (isPaused) {
      return {
        title: "⏸️ టోకెన్ల జారీ తాత్కాలికంగా నిలిపివేయబడింది",
        body: `జారీ తాత్కాలికంగా ఆపబడింది. SSD: ${ssdCount} · DD: ${ddCount} మిగిలాయి. కౌంటర్ల వద్ద వేచి ఉండండి.`
      };
    }
    if (isSuspended) {
      return {
        title: "🚫 ఎస్‌ఎస్‌డి టోకెన్ల జారీ నిలిపివేయబడింది",
        body: "రద్దీ/ఉత్సవాల కారణంగా టోకెన్లు నిలిపివేయబడ్డాయి. తిరుమలలో సర్వదర్శనం నేరుగా చేసుకోవచ్చు."
      };
    }

    // Default Issuing
    const tokenType = isOnlySsdIssuing ? 'ఎస్‌ఎస్‌డి' : isOnlyDdIssuing ? 'డిడి' : 'ఎస్‌ఎస్‌డి & డిడి';
    const countsPrefix = isOnlySsdIssuing 
      ? `SSD: ${ssdCount} మిగిలాయి` 
      : isOnlyDdIssuing 
      ? `DD: ${ddCount} మిగిలాయి` 
      : `SSD: ${ssdCount} · DD: ${ddCount} మిగిలాయి`;

    return {
      title: `🎟️ ${tokenType} టోకెన్లు జారీ అవుతున్నాయి`,
      body: `${countsPrefix} (దర్శనం: ${darshanDate}). ${noticeClean || 'కౌంటర్ల వద్ద వెంటనే పొందండి.'}`
    };
  }

  // 2. BILINGUAL PRESET
  if (language === 'bilingual') {
    if (isCompleted) {
      return {
        title: "⚠️ Quota Completed | నేటి కోటా పూర్తయింది",
        body: `SSD & DD quota closed. ${nextBatchTime ? `Next: ${nextBatchTime}. ` : ''}నేరుగా సర్వదర్శనం తెరిచి ఉంది.`
      };
    }
    if (isPaused) {
      return {
        title: "⏸️ Tokens Paused | జారీ నిలిపివేత",
        body: `SSD: ${ssdCount} · DD: ${ddCount} left. టోకెన్ జారీ తాత్కాలికంగా ఆపబడింది.`
      };
    }
    return {
      title: "🎟️ SSD & DD Tokens Issuing | టోకెన్లు జారీ",
      body: `SSD: ${ssdCount} left · DD: ${ddCount} left (Darshan: ${darshanDate}). కౌంటర్లలో జారీ ప్రారంభం.`
    };
  }

  // 3. ENGLISH PRESET (Default)
  if (isCompleted) {
    return {
      title: "⚠️ Today's SSD & DD Quota Completed",
      body: `SSD & DD quotas completed. ${nextBatchTime ? `Next release: ${nextBatchTime}. ` : ''}Direct walk-in Sarva Darshan open.`
    };
  }

  if (isPaused) {
    return {
      title: "⏸️ SSD & DD Token Issuance Paused",
      body: `Issuance paused temporarily. SSD: ${ssdCount} left · DD: ${ddCount} left. Please stand by at counters.`
    };
  }

  if (isSuspended) {
    return {
      title: "🚫 SSD & DD Tokens Suspended",
      body: "Token issuance suspended. Direct walk-in Sarva Darshan open at Tirumala Vaikuntam."
    };
  }

  // Default Issuing
  const titleType = isOnlySsdIssuing ? 'SSD Tokens' : isOnlyDdIssuing ? 'DD Tokens' : 'SSD & DD Tokens';
  const countsPrefix = isOnlySsdIssuing 
    ? `SSD: ${ssdCount} left` 
    : isOnlyDdIssuing 
    ? `DD: ${ddCount} left` 
    : `SSD: ${ssdCount} left · DD: ${ddCount} left`;

  return {
    title: `🎟️ ${titleType} Issuing Now`,
    body: `${countsPrefix} (Darshan: ${darshanDate}). ${noticeClean || 'Visit the counters soon.'}`
  };
}

