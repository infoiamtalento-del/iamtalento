-- Stage 0: Background maintenance cron schedules via pg_cron (guarded)
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    -- 1. Expire assessment attempts that ran past server_expires_at (every minute)
    begin
      perform cron.unschedule('expire-attempts');
    exception when others then null;
    end;

    perform cron.schedule(
      'expire-attempts',
      '* * * * *',
      'select public.expire_overdue_attempts();'
    );

    -- 2. Cancel stale unpaid billing orders past 30 min (every 10 minutes)
    begin
      perform cron.unschedule('cancel-stale-orders');
    exception when others then null;
    end;

    perform cron.schedule(
      'cancel-stale-orders',
      '*/10 * * * *',
      'select public.cancel_stale_orders();'
    );
  end if;
exception
  when undefined_table or undefined_function then
    null;
end $$;
