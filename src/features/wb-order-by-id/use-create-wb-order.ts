import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import {
  CreateWbOrderMutation,
  CreateWbOrderMutationVariables,
} from '@/gql/graphql';
import { graphql } from '@/gql';
import { client } from '@/graphql/graphql-request';
import { useCallback, useState } from 'react';

interface UploadProgress {
  percent: number;
  isComplete: boolean;
}

export const useCreateWbOrder = (
  options: UseMutationOptions<
    CreateWbOrderMutation,
    Error,
    CreateWbOrderMutationVariables
  > = {},
) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    percent: 0,
    isComplete: false,
  });

  const handleProgress = useCallback((percent: number) => {
    setUploadProgress({
      percent: Number(percent),
      isComplete: Number(percent) === 100,
    });
  }, []);

  const resetProgress = useCallback(() => {
    setUploadProgress({
      percent: 0,
      isComplete: false
    });
  }, [])

  const createWbOrder = graphql(`
    mutation CreateWbOrder($input: WbOrderInput!) {
      saveWbOrder(input: $input) {
        id
        name
        phone
        orderCode
        qrCode
        qrCodeFile
        wbPhone
        status
      }
    }
  `);

  return {
    ...useMutation({
      mutationFn: (variables: CreateWbOrderMutationVariables) => {
        return client.request(createWbOrder, {
          ...variables,
          progressCallback: handleProgress,
        });
      },
      ...options,
    }),
    uploadProgress,
    resetProgress,
  };
};
