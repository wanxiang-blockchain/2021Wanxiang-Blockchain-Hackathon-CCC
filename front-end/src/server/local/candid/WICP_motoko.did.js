export const idlFactory = ({ IDL }) => {
  const AccountIdentifier = IDL.Text;
  const TransactionIndex = IDL.Nat;
  const TransferResponse = IDL.Variant({
    'ok' : TransactionIndex,
    'err' : IDL.Variant({
      'InsufficientBalance' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const BurnResponse = IDL.Variant({
    'ok' : TransactionIndex,
    'err' : IDL.Variant({
      'LessThanMinBurnAmount' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'Other' : IDL.Null,
    }),
  });
  const Operation = IDL.Variant({
    'burn' : IDL.Null,
    'mint' : IDL.Null,
    'approve' : IDL.Null,
    'batchTransfer' : IDL.Null,
    'transfer' : IDL.Null,
  });
  const Time = IDL.Int;
  const OpRecord = IDL.Record({
    'op' : Operation,
    'to' : IDL.Opt(IDL.Principal),
    'fee' : IDL.Nat,
    'from' : IDL.Opt(IDL.Principal),
    'timestamp' : Time,
    'caller' : IDL.Principal,
    'index' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const SubAccount = IDL.Vec(IDL.Nat8);
  const BlockHeight = IDL.Nat64;
  const ICPTransactionRecord = IDL.Record({
    'from_subaccount' : IDL.Opt(SubAccount),
    'blockHeight' : BlockHeight,
  });
  const MintResponse = IDL.Variant({
    'ok' : TransactionIndex,
    'err' : IDL.Variant({
      'BlockError' : IDL.Text,
      'NotTransferType' : IDL.Null,
      'NotRecharge' : IDL.Null,
      'AlreadyMint' : IDL.Null,
    }),
  });
  const Token = IDL.Service({
    'addAccountToReceiveArray' : IDL.Func([AccountIdentifier], [IDL.Bool], []),
    'allowance' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Nat],
        ['query'],
      ),
    'approve' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Nat], []),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'batchTransferFrom' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Principal), IDL.Vec(IDL.Nat)],
        [TransferResponse],
        [],
      ),
    'burn' : IDL.Func([IDL.Nat], [BurnResponse], []),
    'decimals' : IDL.Func([], [IDL.Nat], ['query']),
    'getBurnHistoryByIndex' : IDL.Func(
        [IDL.Nat],
        [IDL.Opt(OpRecord)],
        ['query'],
      ),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getFeeTo' : IDL.Func([], [IDL.Principal], ['query']),
    'getHistory' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(OpRecord)], ['query']),
    'getHistoryByAccount' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(OpRecord)],
        ['query'],
      ),
    'getHistoryByIndex' : IDL.Func([IDL.Nat], [OpRecord], ['query']),
    'getMinBurnAmount' : IDL.Func([], [IDL.Nat], ['query']),
    'getReceiveICPAcc' : IDL.Func([], [IDL.Vec(AccountIdentifier)], ['query']),
    'getUserNumber' : IDL.Func([], [IDL.Nat], ['query']),
    'mint' : IDL.Func([ICPTransactionRecord], [MintResponse], []),
    'mintForOwner' : IDL.Func([IDL.Principal, IDL.Nat], [MintResponse], []),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'owner' : IDL.Func([], [IDL.Principal], ['query']),
    'setFee' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setLedHistoryCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setMinBurnAmount' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'totalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [TransferResponse], []),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TransferResponse],
        [],
      ),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return Token;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
