use anchor_lang::prelude::*;

declare_id!("9qKQ5zuSsN1o8ixj788pLNJfL5yyVXe7Mf7wrZZPUKG7");

mod instructions;
pub(crate) use instructions::*;

#[program]
pub mod solana_world_id_onchain_template {
    use super::*;
    pub fn verify_and_execute(
        ctx: Context<VerifyAndExecute>,
        args: VerifyAndExecuteArgs,
    ) -> Result<()> {
        instructions::verify_and_execute(ctx, args)
    }
}
