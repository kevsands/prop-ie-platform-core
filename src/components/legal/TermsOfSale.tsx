import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsOfSaleProps {
  bookingDepositAmount: number;
  onAccept: () => void;
  onDecline: () => void;
}

export const TermsOfSale: React.FC<TermsOfSaleProps> = ({
  bookingDepositAmount,
  onAccept,
  onDecline
}) => {
  const currentDate = new Date().toLocaleDateString('en-IE');

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          PROP.IE — TERMS OF SALE FOR RESIDENTIAL UNITS (OFF-PLAN)
        </CardTitle>
        <p className="text-center text-sm text-gray-600">
          Last Updated: {currentDate}
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. DEFINITIONS</h3>
              <ul className="space-y-2 text-sm">
                <li>• "Developer" refers to Prop.ie and any legal entity developing Fitzgerald Gardens.</li>
                <li>• "Unit" refers to the individual residential property offered for sale.</li>
                <li>• "Buyer" refers to the person intending to purchase the Unit.</li>
                <li>• "Booking Deposit" is the initial sum paid to reserve a Unit.</li>
                <li>• "Contract for Sale" is the legally binding agreement between Buyer and Developer.</li>
                <li>• "Escrow Account" is the solicitor-held client account where deposits are lodged.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. LEGAL NATURE OF BOOKING</h3>
              <ul className="space-y-2 text-sm">
                <li>• Submission of a booking deposit constitutes an expression of interest only.</li>
                <li>• The Unit is considered reserved subject to contract and availability.</li>
                <li>• No binding agreement arises until both parties have signed the Contract for Sale.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. RESERVATION & BOOKING DEPOSIT</h3>
              <ul className="space-y-2 text-sm">
                <li>• A booking deposit of €{bookingDepositAmount.toLocaleString()} is payable online.</li>
                <li>• The deposit will be held in a secure client escrow account.</li>
                <li>• Deposits are fully refundable prior to execution of the Contract for Sale.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. CONTRACT EXECUTION</h3>
              <ul className="space-y-2 text-sm">
                <li>• The Buyer will receive a digital copy of the Contract for Sale via the platform and/or their solicitor.</li>
                <li>• Contracts may be executed using legally recognised electronic signature services (e.g. DocuSign) compliant with:</li>
                <li className="ml-4">- Irish Statute of Frauds 1695 (as interpreted in modern e-commerce law)</li>
                <li className="ml-4">- eIDAS Regulation (EU Regulation No 910/2014)</li>
                <li className="ml-4">- Electronic Commerce Act 2000 (Ireland)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. SOLICITOR REPRESENTATION</h3>
              <ul className="space-y-2 text-sm">
                <li>• The Buyer must nominate a solicitor before signing the Contract for Sale.</li>
                <li>• The Buyer's solicitor will receive a copy of the contract and may provide counsel before signature.</li>
                <li>• No contract will be deemed binding without solicitor acknowledgment.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. CANCELLATION & COOLING-OFF</h3>
              <ul className="space-y-2 text-sm">
                <li>• Once the Contract for Sale is executed by both parties, the Buyer is legally bound to complete.</li>
                <li>• Buyers should not sign unless they are satisfied with all legal, financial, and mortgage considerations.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. MORTGAGE CONTINGENCIES</h3>
              <ul className="space-y-2 text-sm">
                <li>• The Buyer must confirm mortgage approval or cash funding within the timeframes specified in the Contract for Sale.</li>
                <li>• Failure to secure mortgage approval does not automatically cancel the contract unless specified in writing.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. PERSONAL DATA & PRIVACY</h3>
              <ul className="space-y-2 text-sm">
                <li>• All personal data submitted through the platform is handled in accordance with GDPR and our Privacy Policy.</li>
                <li>• Data is securely transmitted, stored, and shared only with the Buyer's solicitor and related parties for legal compliance.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">9. DISPUTES</h3>
              <ul className="space-y-2 text-sm">
                <li>• These Terms are governed by the laws of Ireland.</li>
                <li>• Disputes arising from the transaction will be subject to the jurisdiction of the Irish courts.</li>
              </ul>
            </section>
          </div>
        </ScrollArea>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <button
            onClick={onDecline}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            I Accept These Terms
          </button>
        </div>
      </CardContent>
    </Card>
  );
};