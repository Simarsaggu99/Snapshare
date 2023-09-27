import { callApi } from '@/utils/apiUtils';
import { transactions } from '@/utils/endpoints/transactions';

export const getAllTransactions = ({ query }) =>
  callApi({
    uriEndPoint: transactions.getAllTransaction.v1,
    query,
  });

export const updateTransactionStatus = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: transactions.updateTransaction.v1,
    pathParams,
    body,
  });
