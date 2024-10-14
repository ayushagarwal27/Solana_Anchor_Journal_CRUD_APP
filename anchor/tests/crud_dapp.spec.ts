import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {CrudDapp} from '../target/types/crud_dapp'
import '@types/jest';

describe('crud_dapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.CrudDapp as Program<CrudDapp>

  const crud_dappKeypair = Keypair.generate()

  it('Initialize CrudDapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        crud_dapp: crud_dappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([crud_dappKeypair])
      .rpc()

    const currentCount = await program.account.crud_dapp.fetch(crud_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment CrudDapp', async () => {
    await program.methods.increment().accounts({ crud_dapp: crud_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.crud_dapp.fetch(crud_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment CrudDapp Again', async () => {
    await program.methods.increment().accounts({ crud_dapp: crud_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.crud_dapp.fetch(crud_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement CrudDapp', async () => {
    await program.methods.decrement().accounts({ crud_dapp: crud_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.crud_dapp.fetch(crud_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set crud_dapp value', async () => {
    await program.methods.set(42).accounts({ crud_dapp: crud_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.crud_dapp.fetch(crud_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the crud_dapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        crud_dapp: crud_dappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.crud_dapp.fetchNullable(crud_dappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
