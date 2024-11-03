import { usePaymentForm } from './usePaymentForm';
import { EVENT_NAME, INITIATOR } from "./enum";

const PaymentForm = () => {
    const { handleSubmit, formHandlers, errors } = usePaymentForm();

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">
                {INITIATOR} собирает на «{EVENT_NAME}»
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Номер карты</label>
                    <input
                        {...formHandlers.cardNumber}
                        className="w-full p-2 border rounded"
                        placeholder="0000 0000 0000 0000"
                    />
                    {errors.cardNumber && (
                        <span className="text-red-500">{errors.cardNumber.message}</span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Срок действия</label>
                        <input
                            {...formHandlers.expiryDate}
                            className="w-full p-2 border rounded"
                            placeholder="ММ/ГГ"
                        />
                        {errors.expiryDate && (
                            <span className="text-red-500">{errors.expiryDate.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">CVV</label>
                        <input
                            type="password"
                            {...formHandlers.cvc}
                            className="w-full p-2 border rounded"
                            maxLength={3}
                        />
                        {errors.cvc && (
                            <span className="text-red-500">{errors.cvc.message}</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Сумма перевода</label>
                    <input
                        type="number"
                        {...formHandlers.amount}
                        className="w-full p-2 border rounded"
                        placeholder="Сумма в рублях"
                    />
                    {errors.amount && (
                        <span className="text-red-500">{errors.amount.message}</span>
                    )}
                </div>

                <div>
                    <label className="block mb-1">Ваше имя</label>
                    <input
                        {...formHandlers.name}
                        className="w-full p-2 border rounded"
                    />
                    {errors.name && (
                        <span className="text-red-500">{errors.name.message}</span>
                    )}
                </div>

                <div>
                    <label className="block mb-1">Сообщение получателю</label>
                    <textarea
                        {...formHandlers.message}
                        className="w-full p-2 border rounded"
                        defaultValue={EVENT_NAME}
                    />
                    {errors.message && (
                        <span className="text-red-500">{errors.message.message}</span>
                    )}
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Перевести
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => window.history.back()}
                    >
                        Вернуться
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;
