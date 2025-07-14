#!/usr/bin/env python3
"""
Backend API Testing for Codigo R Trading Ebook Platform
Tests authentication, sections, site configuration, and analytics endpoints
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Backend URL from frontend/.env
BACKEND_URL = "https://f0e4bbf1-2c54-4390-ae6a-1e8e51d18370.preview.emergentagent.com/api"

class CodigoRAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> requests.Response:
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        default_headers = {"Content-Type": "application/json"}
        
        if headers:
            default_headers.update(headers)
            
        if self.auth_token:
            default_headers["Authorization"] = f"Bearer {self.auth_token}"
            
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
            
    def test_root_endpoint(self):
        """Test root API endpoint"""
        try:
            response = self.make_request("GET", "/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("Root Endpoint", True, f"API responding: {data['message']}")
                else:
                    self.log_test("Root Endpoint", False, "Missing message in response")
            else:
                self.log_test("Root Endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Root Endpoint", False, f"Exception: {str(e)}")
            
    def test_init_admin(self):
        """Initialize admin user"""
        try:
            response = self.make_request("POST", "/init-admin")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Admin Initialization", True, f"Admin setup: {data.get('message', 'Success')}")
            else:
                self.log_test("Admin Initialization", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Admin Initialization", False, f"Exception: {str(e)}")
            
    def test_authentication(self):
        """Test authentication system with admin/admin123"""
        try:
            # Test login with correct credentials
            login_data = {
                "username": "admin",
                "password": "admin123"
            }
            
            response = self.make_request("POST", "/login", login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "token_type" in data:
                    self.auth_token = data["access_token"]
                    is_admin = data.get("is_admin", False)
                    self.log_test("Authentication - Login", True, 
                                f"JWT token received, admin: {is_admin}", 
                                {"token_type": data["token_type"], "is_admin": is_admin})
                else:
                    self.log_test("Authentication - Login", False, "Missing token in response")
            else:
                self.log_test("Authentication - Login", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
            # Test invalid credentials
            invalid_login = {
                "username": "admin",
                "password": "wrongpassword"
            }
            
            response = self.make_request("POST", "/login", invalid_login)
            if response.status_code == 401:
                self.log_test("Authentication - Invalid Credentials", True, "Correctly rejected invalid credentials")
            else:
                self.log_test("Authentication - Invalid Credentials", False, 
                            f"Expected 401, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Authentication", False, f"Exception: {str(e)}")
            
    def test_sections_configuration(self):
        """Test sections configuration endpoints"""
        try:
            # Test GET /api/sections
            response = self.make_request("GET", "/sections")
            
            if response.status_code == 200:
                sections_data = response.json()
                expected_sections = ["header", "hero", "vsl", "features", "testimonials", "pricing", "faq", "footer"]
                
                if all(section in sections_data for section in expected_sections):
                    self.log_test("Sections - GET", True, 
                                f"All sections present: {list(sections_data.keys())}", 
                                sections_data)
                else:
                    missing = [s for s in expected_sections if s not in sections_data]
                    self.log_test("Sections - GET", False, f"Missing sections: {missing}")
            else:
                self.log_test("Sections - GET", False, f"Status: {response.status_code}")
                
            # Test PUT /api/sections (requires authentication)
            if self.auth_token:
                updated_sections = {
                    "header": True,
                    "hero": True,
                    "vsl": False,  # Toggle VSL off
                    "features": True,
                    "testimonials": True,
                    "pricing": True,
                    "faq": False,  # Toggle FAQ off
                    "footer": True
                }
                
                response = self.make_request("PUT", "/sections", updated_sections)
                
                if response.status_code == 200:
                    updated_data = response.json()
                    if updated_data.get("vsl") == False and updated_data.get("faq") == False:
                        self.log_test("Sections - PUT", True, 
                                    "Sections updated successfully", 
                                    updated_data)
                    else:
                        self.log_test("Sections - PUT", False, "Sections not updated correctly")
                else:
                    self.log_test("Sections - PUT", False, f"Status: {response.status_code}")
            else:
                self.log_test("Sections - PUT", False, "No auth token available")
                
        except Exception as e:
            self.log_test("Sections Configuration", False, f"Exception: {str(e)}")
            
    def test_site_configuration(self):
        """Test site configuration endpoints"""
        try:
            # Test GET /api/site-content
            response = self.make_request("GET", "/site-content")
            
            if response.status_code == 200:
                site_data = response.json()
                required_fields = ["hero_title", "hero_subtitle", "features_title", "pricing_title"]
                
                if all(field in site_data for field in required_fields):
                    self.log_test("Site Content - GET", True, 
                                f"Site content retrieved with {len(site_data)} fields")
                else:
                    missing = [f for f in required_fields if f not in site_data]
                    self.log_test("Site Content - GET", False, f"Missing fields: {missing}")
            else:
                self.log_test("Site Content - GET", False, f"Status: {response.status_code}")
                
            # Test GET /api/ebooks
            response = self.make_request("GET", "/ebooks")
            
            if response.status_code == 200:
                ebooks_data = response.json()
                self.log_test("Ebooks - GET", True, 
                            f"Retrieved {len(ebooks_data)} ebooks", 
                            {"count": len(ebooks_data)})
            else:
                self.log_test("Ebooks - GET", False, f"Status: {response.status_code}")
                
            # Test VSL Config
            response = self.make_request("GET", "/vsl-config")
            
            if response.status_code == 200:
                vsl_data = response.json()
                if "enabled" in vsl_data and "title" in vsl_data:
                    self.log_test("VSL Config - GET", True, 
                                f"VSL config retrieved, enabled: {vsl_data.get('enabled')}")
                else:
                    self.log_test("VSL Config - GET", False, "Missing VSL config fields")
            else:
                self.log_test("VSL Config - GET", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Site Configuration", False, f"Exception: {str(e)}")
            
    def test_analytics(self):
        """Test analytics endpoints"""
        try:
            # Test POST /api/analytics/page-view
            response = self.make_request("POST", "/analytics/page-view")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("Analytics - Page View", True, f"Page view tracked: {data['message']}")
                else:
                    self.log_test("Analytics - Page View", False, "Missing message in response")
            else:
                self.log_test("Analytics - Page View", False, f"Status: {response.status_code}")
                
            # Test POST /api/analytics/video-view
            response = self.make_request("POST", "/analytics/video-view")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Analytics - Video View", True, f"Video view tracked: {data.get('message', 'Success')}")
            else:
                self.log_test("Analytics - Video View", False, f"Status: {response.status_code}")
                
            # Test POST /api/analytics/button-click
            response = self.make_request("POST", "/analytics/button-click")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Analytics - Button Click", True, f"Button click tracked: {data.get('message', 'Success')}")
            else:
                self.log_test("Analytics - Button Click", False, f"Status: {response.status_code}")
                
            # Test GET /api/analytics (requires authentication)
            if self.auth_token:
                response = self.make_request("GET", "/analytics")
                
                if response.status_code == 200:
                    analytics_data = response.json()
                    self.log_test("Analytics - GET", True, 
                                f"Retrieved {len(analytics_data)} analytics records", 
                                {"count": len(analytics_data)})
                else:
                    self.log_test("Analytics - GET", False, f"Status: {response.status_code}")
            else:
                self.log_test("Analytics - GET", False, "No auth token available")
                
        except Exception as e:
            self.log_test("Analytics", False, f"Exception: {str(e)}")
            
    def test_products_legacy(self):
        """Test legacy products endpoints"""
        try:
            response = self.make_request("GET", "/products")
            
            if response.status_code == 200:
                products_data = response.json()
                self.log_test("Products - GET", True, 
                            f"Retrieved {len(products_data)} products", 
                            {"count": len(products_data)})
            else:
                self.log_test("Products - GET", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Products", False, f"Exception: {str(e)}")
            
    def test_data_persistence(self):
        """Test data persistence by making multiple requests"""
        try:
            if not self.auth_token:
                self.log_test("Data Persistence", False, "No auth token for persistence test")
                return
                
            # Update sections and verify persistence
            test_sections = {
                "header": True,
                "hero": False,  # Toggle hero off
                "vsl": True,
                "features": False,  # Toggle features off
                "testimonials": True,
                "pricing": True,
                "faq": True,
                "footer": True
            }
            
            # Update sections
            response = self.make_request("PUT", "/sections", test_sections)
            if response.status_code != 200:
                self.log_test("Data Persistence", False, "Failed to update sections")
                return
                
            # Retrieve sections to verify persistence
            response = self.make_request("GET", "/sections")
            if response.status_code == 200:
                retrieved_sections = response.json()
                if (retrieved_sections.get("hero") == False and 
                    retrieved_sections.get("features") == False):
                    self.log_test("Data Persistence", True, "Sections changes persisted correctly")
                else:
                    self.log_test("Data Persistence", False, "Sections changes not persisted")
            else:
                self.log_test("Data Persistence", False, "Failed to retrieve sections for persistence test")
                
        except Exception as e:
            self.log_test("Data Persistence", False, f"Exception: {str(e)}")
            
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Codigo R Backend API Tests")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        self.test_root_endpoint()
        self.test_init_admin()
        self.test_authentication()
        self.test_sections_configuration()
        self.test_site_configuration()
        self.test_analytics()
        self.test_products_legacy()
        self.test_data_persistence()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        if total - passed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['details']}")
                    
        print(f"\n🎯 Success Rate: {(passed/total)*100:.1f}%")
        
        return passed == total

if __name__ == "__main__":
    tester = CodigoRAPITester()
    success = tester.run_all_tests()
    
    if not success:
        sys.exit(1)
    else:
        print("\n🎉 All tests passed! Backend is working correctly.")