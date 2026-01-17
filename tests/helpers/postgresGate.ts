export const describePostgres = process.env.ENABLE_POSTGRES_TESTS === 'true' ? describe : describe.skip;
export const itPostgres = process.env.ENABLE_POSTGRES_TESTS === 'true' ? it : it.skip;
