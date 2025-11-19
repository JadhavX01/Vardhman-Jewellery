import React from 'react';
import { X, Package, Calendar, MapPin, Phone, Weight } from 'lucide-react';

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#b8860b] text-white p-6 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold">Order Details</h2>
            <p className="text-sm opacity-90 mt-1">#{order.CustInNo}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#b8860b] flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Information
              </h3>
              
              <div className="bg-[#fef5e7] p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold">{order.CustInNo}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-semibold">
                    {formatDate(order.TDate)}
                  </span>
                </div>
                
                {order.DelDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Date:</span>
                    <span className="font-semibold">
                      {formatDate(order.DelDate)}
                    </span>
                  </div>
                )}
                
                {order.TotWt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Weight className="w-4 h-4" />
                      Total Weight:
                    </span>
                    <span className="font-semibold">{order.TotWt}g</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="text-gray-600 font-semibold">
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold text-[#b8860b]">
                    ₹{parseFloat(order.OnAmt || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#b8860b] flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Information
              </h3>
              
              <div className="bg-[#fef5e7] p-4 rounded-lg space-y-3">
                {order.Add1 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address:</p>
                    <p className="font-medium text-gray-800">
                      {order.Add1}
                      {order.Add2 && (
                        <>
                          <br />
                          {order.Add2}
                        </>
                      )}
                    </p>
                  </div>
                )}
                
                {order.PhNo && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-300">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{order.PhNo}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-[#b8860b] mb-4">
              Order Items ({order.items?.length || 0})
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#b8860b] text-white">
                    <th className="px-4 py-3 text-left rounded-tl-lg">Item</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-center">Weight (g)</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-[#fff9c4] hover:bg-opacity-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.ItemNo}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {item.Description}
                          {item.SubCategory && (
                            <span className="block text-xs text-gray-500 mt-1">
                              {item.SubCategory}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold">
                          {item.Qty}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.GWt || '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[#b8860b]">
                          ₹{parseFloat(item.OAmt || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
                
                {/* Total Row */}
                {order.items && order.items.length > 0 && (
                  <tfoot>
                    <tr className="bg-[#fef5e7]">
                      <td
                        colSpan="4"
                        className="px-4 py-4 text-right font-bold text-gray-800"
                      >
                        Total Amount:
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-xl text-[#b8860b]">
                        ₹{parseFloat(order.OnAmt || 0).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-[#b8860b] text-[#b8860b] rounded-lg hover:bg-[#fff9c4] transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-[#b8860b] text-white rounded-lg hover:bg-[#9b7a0a] transition-colors font-medium"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
