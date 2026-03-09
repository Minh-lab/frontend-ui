import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Modal from '@/components/Modal';

const schema = Yup.object().shape({
  current: Yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
  new1: Yup.string()
    .min(6, 'Mật khẩu mới phải ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu mới'),
  new2: Yup.string()
    .oneOf([Yup.ref('new1')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

const fields = [
  ['Mật khẩu hiện tại', 'current'],
  ['Mật khẩu mới', 'new1'],
  ['Xác nhận mật khẩu mới', 'new2'],
];

const ChangePassword = ({ setShowPwC }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: { current: '', new1: '', new2: '' },
  });

  const onSubmit = async (data) => {
  try {
    console.log('Gui len server:', data);

    // TODO: gọi API đổi mật khẩu ở đây
    // await authService.changePassword(data);

    toast.success('Đổi mật khẩu thành công', {
      className: '!bg-[#AAFAB8] !text-[#24AD47]',
    });

    setShowPwC(false);
    } catch (error) {
      toast.error('Đổi mật khẩu thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <Modal title="Đổi mật khẩu" onClose={() => setShowPwC(false)} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {fields.map(([label, key]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
              <input
                type="password"
                {...register(key)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
              />
              <p className="text-red-500 text-xs mt-1">{errors[key]?.message}</p>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPwC(false)}
              className="px-5 py-2.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm bg-[#5c60c0] text-white rounded-lg hover:bg-[#4a4ea8] font-medium transition"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePassword;
