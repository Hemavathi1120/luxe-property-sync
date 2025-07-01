
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator as CalculatorIcon, DollarSign, Percent, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/navbar';

const Calculator = () => {
  const [loanAmount, setLoanAmount] = useState([500000]);
  const [downPayment, setDownPayment] = useState([100000]);
  const [interestRate, setInterestRate] = useState([6.5]);
  const [loanTerm, setLoanTerm] = useState([30]);
  const [propertyTax, setPropertyTax] = useState([5000]);
  const [insurance, setInsurance] = useState([1200]);
  const [hoa, setHoa] = useState([0]);

  const calculateMortgage = () => {
    const principal = loanAmount[0] - downPayment[0];
    const monthlyRate = interestRate[0] / 100 / 12;
    const numberOfPayments = loanTerm[0] * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const monthlyTax = propertyTax[0] / 12;
    const monthlyInsurance = insurance[0] / 12;
    const monthlyHoa = hoa[0];
    
    const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance + monthlyHoa;
    
    return {
      monthlyPayment: monthlyPayment,
      monthlyTax: monthlyTax,
      monthlyInsurance: monthlyInsurance,
      monthlyHoa: monthlyHoa,
      totalMonthlyPayment: totalMonthlyPayment,
      totalInterest: (monthlyPayment * numberOfPayments) - principal,
      totalCost: totalMonthlyPayment * numberOfPayments + downPayment[0]
    };
  };

  const results = calculateMortgage();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Mortgage Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate your monthly mortgage payments and explore different loan scenarios
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalculatorIcon className="h-5 w-5" />
                    Loan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Home Price */}
                  <div className="space-y-2">
                    <Label>Home Price</Label>
                    <div className="space-y-3">
                      <Input
                        type="number"
                        value={loanAmount[0]}
                        onChange={(e) => setLoanAmount([Number(e.target.value)])}
                        className="text-lg"
                      />
                      <Slider
                        value={loanAmount}
                        onValueChange={setLoanAmount}
                        max={2000000}
                        min={100000}
                        step={10000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>$100K</span>
                        <span>$2M</span>
                      </div>
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div className="space-y-2">
                    <Label>Down Payment</Label>
                    <div className="space-y-3">
                      <Input
                        type="number"
                        value={downPayment[0]}
                        onChange={(e) => setDownPayment([Number(e.target.value)])}
                        className="text-lg"
                      />
                      <Slider
                        value={downPayment}
                        onValueChange={setDownPayment}
                        max={loanAmount[0] * 0.5}
                        min={loanAmount[0] * 0.05}
                        step={5000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{((downPayment[0] / loanAmount[0]) * 100).toFixed(1)}%</span>
                        <span>{formatCurrency(downPayment[0])}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <div className="space-y-3">
                      <Input
                        type="number"
                        step="0.1"
                        value={interestRate[0]}
                        onChange={(e) => setInterestRate([Number(e.target.value)])}
                        className="text-lg"
                      />
                      <Slider
                        value={interestRate}
                        onValueChange={setInterestRate}
                        max={10}
                        min={3}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>3%</span>
                        <span>10%</span>
                      </div>
                    </div>
                  </div>

                  {/* Loan Term */}
                  <div className="space-y-2">
                    <Label>Loan Term (Years)</Label>
                    <div className="space-y-3">
                      <Input
                        type="number"
                        value={loanTerm[0]}
                        onChange={(e) => setLoanTerm([Number(e.target.value)])}
                        className="text-lg"
                      />
                      <Slider
                        value={loanTerm}
                        onValueChange={setLoanTerm}
                        max={40}
                        min={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>10 years</span>
                        <span>40 years</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Costs */}
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Annual Property Tax</Label>
                      <Input
                        type="number"
                        value={propertyTax[0]}
                        onChange={(e) => setPropertyTax([Number(e.target.value)])}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Annual Insurance</Label>
                      <Input
                        type="number"
                        value={insurance[0]}
                        onChange={(e) => setInsurance([Number(e.target.value)])}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly HOA</Label>
                      <Input
                        type="number"
                        value={hoa[0]}
                        onChange={(e) => setHoa([Number(e.target.value)])}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Monthly Payment Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Monthly Payment Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {formatCurrency(results.totalMonthlyPayment)}
                    </div>
                    <div className="text-sm text-gray-600">Total Monthly Payment</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal & Interest</span>
                      <span className="font-semibold">{formatCurrency(results.monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Tax</span>
                      <span className="font-semibold">{formatCurrency(results.monthlyTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance</span>
                      <span className="font-semibold">{formatCurrency(results.monthlyInsurance)}</span>
                    </div>
                    {results.monthlyHoa > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">HOA</span>
                        <span className="font-semibold">{formatCurrency(results.monthlyHoa)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Loan Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Loan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(loanAmount[0] - downPayment[0])}
                      </div>
                      <div className="text-sm text-gray-600">Loan Amount</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(results.totalInterest)}
                      </div>
                      <div className="text-sm text-gray-600">Total Interest</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-xl font-bold text-amber-800">
                      {formatCurrency(results.totalCost)}
                    </div>
                    <div className="text-sm text-amber-600">Total Cost of Loan</div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
              >
                Get Pre-Approved
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
