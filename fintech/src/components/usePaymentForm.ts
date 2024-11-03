import { useForm } from 'react-hook-form';
import { API_KEY, EVENT_NAME, INITIATOR, SECRET } from "./enum";
import { FormInputs } from "./types";

// Вспомогательные функции
const validateLuhn = (cardNumber: string): boolean => {
    const number = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

const generateHash = async (message: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
};

// Форматтеры
const formatCardNumber = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, '$1 ');
};

const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
};

export const usePaymentForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        const cardNumber = data.cardNumber.replace(/\D/g, '');

        if (!validateLuhn(cardNumber)) {
            alert('Неверный номер карты');
            return;
        }

        const transaction = Date.now().toString();
        const amountInKopeks = Math.round(data.amount * 100);

        // Формирование hash_sum
        const hashString = `${API_KEY}${transaction}${amountInKopeks}${SECRET}`;
        const hashSum = await generateHash(hashString);

        const requestBody = {
            hash_sum: hashSum,
            transaction,
            description: data.message,
            api_key: API_KEY,
            amount: data.amount,
            email: '', // опционально
            custom_data: {
                initiator: INITIATOR,
                event_name: EVENT_NAME
            }
        };

        try {
            // Имитация отправки запроса
            console.log('Request body:', requestBody);
            // В реальном приложении здесь был бы fetch запрос
            alert('Данные успешно отправлены');
        } catch (error) {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке данных');
        }
    };

    const formHandlers = {
        cardNumber: {
            ...register('cardNumber', {
                required: 'Введите номер карты',
                validate: (value) => validateLuhn(value) || 'Неверный номер карты'
            }),
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = formatCardNumber(e.target.value);
            }
        },
        expiryDate: {
            ...register('expiryDate', {
                required: 'Введите срок',
                pattern: {
                    value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                    message: 'Формат: ММ/ГГ'
                }
            }),
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = formatExpiryDate(e.target.value);
            }
        },
        cvc: register('cvc', {
            required: 'Введите CVV',
            pattern: {
                value: /^[0-9]{3}$/,
                message: 'CVV должен содержать 3 цифры'
            }
        }),
        amount: register('amount', {
            required: 'Введите сумму',
            min: {
                value: 10,
                message: 'Минимальная сумма 10 рублей'
            }
        }),
        name: register('name', {
            required: 'Введите имя',
            maxLength: {
                value: 50,
                message: 'Максимальная длина 50 символов'
            }
        }),
        message: register('message', {
            required: 'Введите сообщение',
            maxLength: {
                value: 50,
                message: 'Максимальная длина 50 символов'
            }
        })
    };

    return {
        handleSubmit: handleSubmit(onSubmit),
        formHandlers,
        errors,
        watch
    };
};
