import { FC, useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/webp',
];

import { toast } from 'sonner';
import PhoneInputWithCountrySelect, {
  isPossiblePhoneNumber,
} from 'react-phone-number-input';
import ru from 'react-phone-number-input/locale/ru.json';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useCreateWbOrder } from '@/features/wb-order-by-id';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/phone-input';

const FormSchema = z
  .object({
    FLP: z
      .string({ required_error: 'ФИО обязательно к заполнению!' })
      .refine(value => {
        const parts = value.trim().split(/\s+/);
        const namePattern = /^[a-zа-я]+$/i;
        return (
          parts.length === 3 && parts.every(part => namePattern.test(part))
        );
      }, 'Необходимо заполнить Имя, Фамилию и Отчество'),
    phone: z
      .string({ required_error: 'Телефон обязателен к заполнению!' })
      .refine(
        value => isPossiblePhoneNumber(value),
        'Проверьте пожалуйста еще раз! Телефон не заполнен до конца!',
      ),
    wbPhone: z
      .string({ required_error: 'Телефон обязателен к заполнению!' })
      .optional()
      .refine(
        value => value === undefined || isPossiblePhoneNumber(value),
        'Проверьте пожалуйста еще раз! Телефон не заполнен до конца!',
      ),
    orderCode: z
      .string({ required_error: 'Код заказа обязателен к заполнению!' })
      .optional()
      .refine(value => {
        return value === undefined || value.length === 5;
      }, 'Код не заполнен!'),
    QR: z
      .array(z.instanceof(File))
      .nullable()
      .optional()
      .refine(files => {
        return (
          files === null || files?.every(file => file.size <= MAX_FILE_SIZE)
        );
      }, `Максимальный размер файла не должен превышать 5 мегабайт.`)
      .refine(
        files =>
          files === null ||
          files?.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        '.jpg, .jpeg, .png, .webp расширения файла необходимо прикреплять!',
      ),
  })
  .refine(
    data => {
      const isWbFilled = !!data.wbPhone && !!data.orderCode;
      const isQRFilled = !!data.QR;

      return isWbFilled || isQRFilled;
    },
    {
      message:
        'Заполните либо (Телефон Wb и Код для получения заказа), либо прикрепите QR-код, либо все вместе',
      path: ['QR'],
    },
  );

type DefaultValues = z.infer<typeof FormSchema>;

const defaultValues: DefaultValues = {
  phone: '',
  wbPhone: '',
  FLP: '',
  orderCode: '',
  QR: null,
};

const WbOrderPage: FC = () => {
  const form = useForm<DefaultValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const formState = form.formState;

  console.log({
    errors: formState.errors,
    dirtyFields: formState.dirtyFields,
    formState,
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const { mutateAsync: createOrder, data } = useCreateWbOrder();

  useEffect(() => {
    if (data?.saveWbOrder.qrCodeFile) {
      const type = data.saveWbOrder.qrCodeFile.type as string;
      const buffer = data.saveWbOrder.qrCodeFile.buffer;
      import.meta.env.DEV && console.log({ type, buffer });

      if (typeof buffer === 'object' && 'data' in buffer) {
        const uint8Array = new Uint8Array(buffer.data);

        const base64 = btoa(
          uint8Array.reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );

        const dataUrl = `data:${type};base64,${base64}`;
        setQrCodeUrl(dataUrl);
      } else {
        console.error('Received buffer is not in the expected format');
      }
    }
  }, [data]);

  const onSubmit: SubmitHandler<DefaultValues> = data => {
    console.log({ data });
    toast(
      <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
        <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );
  };

  return (
    <div className='container sm:mt-5'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full sm:max-w-screen-sm space-y-6 mx-auto'
        >
          <div className="border rounded-md p-6">
            <div className="flex flex-col space-y-1.5 mb-6">
              <h3 className="font-semibold tracking-tight text-xl">Wildberries</h3>
              <p className="text-sm text-muted-foreground">Введите информацию для оформления заказа.</p>
            </div>

            <div className="space-y-4">
              <div className='grid grid-cols-[repeat(auto-fill,_minmax(17rem,_1fr))] gap-1 gap-y-2'>
                <FormField
                  control={form.control}
                  name='FLP'
                  render={({ field: { onChange, ...field } }) => {
                    return (
                      <FormItem>
                        <FormLabel>ФИО</FormLabel>
                        <FormControl>
                          <Input
                            onChange={e => {
                              const capitalizeFirstChars = (value: string) => {
                                const words = value.split(' ');
                                const capitalizedWorlds = words
                                  .map(w => w.replace(/^./, w.at(0)?.toUpperCase()))
                                  .join(' ');
                                return capitalizedWorlds;
                              };

                              onChange(capitalizeFirstChars(e.target.value));
                            }}
                            placeholder={'Иванов Иван Иванович'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <PhoneInput
                            countries={['RU']}
                            international
                            labels={ru}
                            countryCallingCodeEditable={false}
                            defaultCountry={'RU'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name='QR'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>QR-код для получения заказа</FormLabel>
                        <FormControl></FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className='grid grid-cols-[repeat(auto-fill,_minmax(17rem,_1fr))] gap-1 gap-y-2'>
                <Button
                  className='w-full sm:w-auto col-start-1 col-end-2'
                  type='submit'
                >
                  Зарегестрировать
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WbOrderPage;
