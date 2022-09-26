export const bigIntJsonParser = () => {
  BigInt.prototype['toJSON'] = function () {
    return this.toString();
  };
};
