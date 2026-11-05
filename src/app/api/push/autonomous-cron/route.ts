import { NextResponse } from 'next/server';
import { executeAutonomousCycle, evaluateAutonomousTrigger } from '@/services/notifications/autonomousEngine';

export const dynamic = 'force-dynamic';

function checkAuth(req: Request): boolean {
  const authHeader = req.headers.get('authorization');
  const cronSecretHeader = req.headers.get('x-cron-secret');
  const url = new URL(req.url);
  const cronSecretQuery = url.searchParams.get('cron_secret');

  const validSecrets = new Set([
    'saarthi_cron_secret_2026',
    'saarthi_cron_sec_8a39f1c7d2e4',
    process.env.CRON_SECRET || ''
  ].filter(Boolean));

  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;

  return (
    Boolean(cronSecretHeader && validSecrets.has(cronSecretHeader)) ||
    Boolean(cronSecretQuery && validSecrets.has(cronSecretQuery)) ||
    Boolean(bearerToken && validSecrets.has(bearerToken))
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isPreview = url.searchParams.get('preview') === 'true';
  const dryRun = url.searchParams.get('dry_run') === 'true' || isPreview;

  // Allow preview without auth for transparency & debugging
  if (!isPreview && !checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isPreview) {
    const decision = await evaluateAutonomousTrigger();
    return NextResponse.json({
      status: 'preview_only',
      decision,
      explainability: decision.reason
    });
  }

  const result = await executeAutonomousCycle(dryRun);
  return NextResponse.json({
    success: true,
    dryRun,
    ...result
  });
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const dryRun = Boolean(body?.dry_run);

  const result = await executeAutonomousCycle(dryRun);
  return NextResponse.json({
    success: true,
    dryRun,
    ...result
  });
}
