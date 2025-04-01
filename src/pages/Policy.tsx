
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Shield, FileText, Cookie, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/layout/BottomNav";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Policy() {
  const navigate = useNavigate();
  const [activePolicy, setActivePolicy] = useState<string>("privacy");

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-charcoal pb-20">
      <header className="fixed top-0 w-full bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            className="text-gray-400 hover:text-white hover:bg-gray-800 mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Policies</h1>
        </div>
      </header>

      <main className="pt-20 px-4 pb-8">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden mb-6">
          <div className="flex w-full border-b border-gray-700">
            {["privacy", "terms", "cookies", "data"].map((policy) => (
              <button
                key={policy}
                onClick={() => setActivePolicy(policy)}
                className={`flex-1 px-3 py-4 text-sm font-medium transition-colors focus:outline-none
                  ${activePolicy === policy 
                    ? "bg-primary text-charcoal font-semibold shadow-lg" 
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
              >
                {policy.charAt(0).toUpperCase() + policy.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activePolicy === "privacy" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-900/30 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Privacy Policy</h2>
                </div>
                
                <p className="text-gray-300">
                  This Privacy Policy describes how My Headache Experience Journal ("we", "us", or "our") 
                  collects, uses, and discloses your personal information when you use our application.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Information We Collect</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Personal Information</strong>: Name, email address, age, gender that you provide when creating an account.</li>
                        <li><strong>Health Information</strong>: Details about your headaches including pain intensity, location, symptoms, potential triggers, and medications.</li>
                        <li><strong>Usage Data</strong>: Information about how you interact with our application, including log data, device information, and app usage statistics.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">How We Use Your Information</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <ul className="list-disc pl-6 space-y-2">
                        <li>To provide, maintain, and improve our Service</li>
                        <li>To personalize your experience and deliver content relevant to your headache patterns</li>
                        <li>To analyze usage patterns and optimize our application</li>
                        <li>To communicate with you about updates, security alerts, and support</li>
                        <li>To detect, prevent, and address technical issues or fraudulent activity</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Legal Basis for Processing</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We process your information under the following legal bases:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li><strong>Consent</strong>: We collect and process your data based on your explicit consent.</li>
                        <li><strong>Contract</strong>: Processing is necessary for the performance of our contract to provide you with our services.</li>
                        <li><strong>Legitimate Interests</strong>: We process data for our legitimate business interests, such as improving our service, as long as these interests aren't overridden by your rights.</li>
                        <li><strong>Legal Obligation</strong>: We may process your data to comply with legal requirements.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Data Sharing and Disclosure</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We do not sell your personal data. We may share your information with:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li><strong>Service Providers</strong>: Third-party companies that perform services on our behalf, such as data analytics, email delivery, hosting services, and customer service.</li>
                        <li><strong>Legal Requirements</strong>: When required by law, such as in response to a subpoena or court order.</li>
                        <li><strong>Business Transfers</strong>: If we are involved in a merger, acquisition, or sale of assets.</li>
                        <li><strong>With Your Consent</strong>: We may share information with third parties when you have given us your consent to do so.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Your Rights</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>Depending on your location, you may have the following rights regarding your data:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li><strong>Access</strong>: The right to request copies of your personal data.</li>
                        <li><strong>Rectification</strong>: The right to request that we correct inaccurate information about you.</li>
                        <li><strong>Erasure</strong>: The right to request that we delete your personal data.</li>
                        <li><strong>Restrict Processing</strong>: The right to request that we restrict the processing of your data.</li>
                        <li><strong>Data Portability</strong>: The right to request that we transfer your data to another organization or directly to you.</li>
                        <li><strong>Object</strong>: The right to object to our processing of your personal data.</li>
                      </ul>
                      <p className="mt-2">To exercise these rights, please contact us at privacy@headachejournal.com</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Data Retention</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We retain your personal data for as long as necessary to provide you with our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need personal data, we securely delete or anonymize it.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-7" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Children's Privacy</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>Our service is not intended for use by children under the age of 16 without parental consent. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and you are aware that your child has provided us with personal information without your consent, please contact us. If we become aware that we have collected personal information from children without verification of parental consent, we will take steps to remove that information from our servers.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-8" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Changes to this Privacy Policy</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-9" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Contact Us</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                      <p className="mt-2">Email: privacy@headachejournal.com</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-6 text-sm text-gray-400">
                  Last Updated: June 1, 2023
                </div>
              </div>
            )}
            
            {activePolicy === "terms" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-900/30 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Terms of Service</h2>
                </div>
                
                <p className="text-gray-300">
                  These Terms of Service ("Terms") govern your access to and use of our services, including our website
                  and mobile application (the "Service").
                </p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Acceptance of Terms</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, then you may not access the Service.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">User Accounts</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                      <p className="mt-2">You are responsible for safeguarding the password you use to access the Service and for any activities or actions under your password.</p>
                      <p className="mt-2">You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Intellectual Property</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>The Service and its original content, features, and functionality are and will remain the exclusive property of My Headache Experience Journal and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
                      <p className="mt-2">Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of My Headache Experience Journal.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Limitation of Liability</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>In no event shall My Headache Experience Journal, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Your access to or use of or inability to access or use the Service;</li>
                        <li>Any conduct or content of any third party on the Service;</li>
                        <li>Any content obtained from the Service; and</li>
                        <li>Unauthorized access, use or alteration of your transmissions or content.</li>
                      </ul>
                      <p className="mt-2">The information provided through the Service is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Termination</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                      <p className="mt-2">Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or request account deletion through the app settings.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Changes to Terms</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
                      <p className="mt-2">By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-6 text-sm text-gray-400">
                  Last Updated: June 1, 2023
                </div>
              </div>
            )}
            
            {activePolicy === "cookies" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-900/30 p-2 rounded-full">
                    <Cookie className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Cookie Policy</h2>
                </div>
                
                <p className="text-gray-300">
                  This Cookie Policy explains how My Headache Experience Journal uses cookies and similar technologies 
                  to recognize you when you visit our application. It explains what these technologies are and 
                  why we use them, as well as your rights to control our use of them.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">What Are Cookies?</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website or use an application. Cookies are widely used by website and app owners in order to make their platforms work, or to work more efficiently, as well as to provide reporting information.</p>
                      <p className="mt-2">Cookies set by us are called "first-party cookies". Cookies set by parties other than us are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through our application (e.g., advertising, interactive content and analytics).</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Types of Cookies We Use</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We use the following types of cookies:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li><strong>Necessary Cookies</strong>: These cookies are essential for you to browse our application and use its features, such as accessing secure areas of the site. The information collected by these cookies relate to the operation of our application, for example website scripting language and security tokens to maintain secure areas of our application.</li>
                        <li><strong>Preference Cookies</strong>: These cookies allow our application to remember choices you have made in the past, like your language preferences, or your user preferences (theme settings, font size, etc.).</li>
                        <li><strong>Analytics Cookies</strong>: These cookies collect information about how you use our application, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you.</li>
                        <li><strong>Marketing Cookies</strong>: These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">How We Use Cookies</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We use cookies for the following purposes:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>To authenticate users and prevent fraudulent use of user accounts.</li>
                        <li>To remember information about your preferences and settings.</li>
                        <li>To understand and save your preferences for future visits.</li>
                        <li>To track and analyze usage patterns so we can improve how our application works.</li>
                        <li>To customize content and advertisements based on your interests.</li>
                        <li>To measure the effectiveness of our marketing campaigns.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Your Choices Regarding Cookies</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>If you prefer to avoid the use of cookies on our application, you must first disable the use of cookies in your browser and then delete the cookies saved in your browser associated with this website. You may use this option for preventing the use of cookies at any time.</p>
                      <p className="mt-2">You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can negatively impact your user experience and parts of our application may no longer be fully accessible.</p>
                      <p className="mt-2">Most browsers automatically accept cookies, but you can choose whether or not to accept cookies through your browser settings, often found in your browser's "Tools" or "Preferences" menu. For more information on how to modify your browser settings or how to block, manage or filter cookies can be found in your browser's help file or through sites such as: <a href="https://www.allaboutcookies.org" className="text-primary hover:underline">www.allaboutcookies.org</a>.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-6 text-sm text-gray-400">
                  Last Updated: June 1, 2023
                </div>
              </div>
            )}
            
            {activePolicy === "data" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-900/30 p-2 rounded-full">
                    <Database className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Data Protection</h2>
                </div>
                
                <p className="text-gray-300">
                  My Headache Experience Journal is committed to protecting the data you share with us. This page explains 
                  our practices regarding data protection and your rights concerning your personal information.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Data Security Measures</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We implement appropriate technical and organizational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. These measures include:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>End-to-end encryption of sensitive data</li>
                        <li>Regular security audits and vulnerability testing</li>
                        <li>Strict access controls and authentication requirements</li>
                        <li>Regular staff training on data security practices</li>
                        <li>Secure data centers with physical security measures</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Data Retention Periods</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.</p>
                      <p className="mt-2">Specific retention periods:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Account information: For as long as your account remains active, plus 30 days after account deletion</li>
                        <li>Health data: For as long as your account remains active, unless specifically deleted by you</li>
                        <li>Usage data: 24 months from collection</li>
                        <li>Communications: 24 months after your last communication with us</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Data Access, Correction & Deletion</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>You can access, export, and delete your data directly through the app:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li><strong>Access and Export</strong>: Go to Profile → Data Management → Export My Data to download a copy of all your personal data in a machine-readable format.</li>
                        <li><strong>Correction</strong>: You can update your personal information in the Profile section.</li>
                        <li><strong>Deletion</strong>: Go to Profile → Data Management → Delete My Data to permanently remove all your personal information from our systems.</li>
                      </ul>
                      <p className="mt-2">For any data access requests or concerns that cannot be handled through the app, please contact our Data Protection Officer at privacy@headachejournal.com.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">International Data Transfers</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>Your information may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.</p>
                      <p className="mt-2">If you are located outside the United States and choose to provide information to us, please note that we transfer the data to the United States and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
                      <p className="mt-2">We ensure that international transfers of data comply with applicable data protection laws, including the use of Standard Contractual Clauses or other approved transfer mechanisms.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">Data Protection Officer</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p>We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this privacy notice. If you have any questions about this privacy notice, including any requests to exercise your legal rights, please contact the DPO at:</p>
                      <p className="mt-2">Email: dpo@headachejournal.com</p>
                      <p>You have the right to make a complaint at any time to your local supervisory authority for data protection issues.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-6 text-sm text-gray-400">
                  Last Updated: June 1, 2023
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
