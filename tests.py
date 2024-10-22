import unittest
from app import calculate_credits

class TestCreditCalculation(unittest.TestCase):

    def test_calculate_credits_with_report_id(self):
        message = {
            'text': 'Generate a report.',
            'report_id': 1124
        }
        credits, report_name = calculate_credits(message)
        self.assertIsInstance(credits, float)
        self.assertEqual(report_name, "Short Lease Report")
        self.assertEqual(credits, 61.0)

    def test_calculate_credits_without_report_id(self):
        message = {
            'text': 'What are the indemnity provisions?'
        }
        credits, report_name = calculate_credits(message)
        self.assertIsInstance(credits, float)
        self.assertIsNone(report_name)

    def test_palindrome_credit(self):
        message = {
            'text': 'A man, a plan, a canal: Panama'
        }
        credits, report_name = calculate_credits(message)
        self.assertGreater(credits, 1)

    def test_unique_words_credit(self):
        message = {
            'text': 'Hello world'
        }
        credits, report_name = calculate_credits(message)
        self.assertEqual(credits, 1)  # Base cost + words cost

if __name__ == '__main__':
    unittest.main()
