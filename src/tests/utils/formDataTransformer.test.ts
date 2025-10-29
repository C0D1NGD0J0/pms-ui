import {
  transformToFormData,
  prepareRequestData,
  hasFiles,
} from "@utils/formDataTransformer";

describe("formDataTransformer", () => {
  describe("hasFiles", () => {
    it("should return true for File objects", () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      expect(hasFiles(file)).toBe(true);
    });

    it("should return false for primitives", () => {
      expect(hasFiles("string")).toBe(false);
      expect(hasFiles(123)).toBe(false);
      expect(hasFiles(true)).toBe(false);
      expect(hasFiles(null)).toBe(false);
      expect(hasFiles(undefined)).toBe(false);
    });

    it("should detect files in arrays", () => {
      const file = new File(["content"], "test.txt");
      expect(hasFiles([file])).toBe(true);
      expect(hasFiles([1, 2, file])).toBe(true);
      expect(hasFiles([1, 2, 3])).toBe(false);
    });

    it("should detect files in nested arrays", () => {
      const file = new File(["content"], "test.txt");
      expect(hasFiles([[file]])).toBe(true);
      expect(hasFiles([{ nested: file }])).toBe(true);
    });

    it("should detect files in objects", () => {
      const file = new File(["content"], "test.txt");
      expect(hasFiles({ file })).toBe(true);
      expect(hasFiles({ name: "test", file })).toBe(true);
      expect(hasFiles({ name: "test", age: 25 })).toBe(false);
    });

    it("should detect files in deeply nested objects", () => {
      const file = new File(["content"], "test.txt");
      expect(hasFiles({ user: { profile: { avatar: file } } })).toBe(true);
      expect(hasFiles({ data: { files: [file] } })).toBe(true);
    });

    it("should return false for empty collections", () => {
      expect(hasFiles([])).toBe(false);
      expect(hasFiles({})).toBe(false);
    });
  });

  describe("transformToFormData", () => {
    it("should transform simple object to FormData", () => {
      const data = {
        name: "John Doe",
        age: 30,
        active: true,
      };

      const formData = transformToFormData(data);

      expect(formData.get("name")).toBe("John Doe");
      expect(formData.get("age")).toBe("30");
      expect(formData.get("active")).toBe("true");
    });

    it("should append File objects correctly", () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const data = {
        name: "Test",
        document: file,
      };

      const formData = transformToFormData(data);

      expect(formData.get("name")).toBe("Test");
      expect(formData.get("document")).toBeInstanceOf(File);
      expect((formData.get("document") as File).name).toBe("test.txt");
    });

    it("should handle arrays of primitives", () => {
      const data = {
        tags: ["javascript", "typescript", "react"],
      };

      const formData = transformToFormData(data);

      expect(formData.get("tags[0]")).toBe("javascript");
      expect(formData.get("tags[1]")).toBe("typescript");
      expect(formData.get("tags[2]")).toBe("react");
    });

    it("should handle arrays of File objects", () => {
      const file1 = new File(["content1"], "file1.txt");
      const file2 = new File(["content2"], "file2.txt");
      const data = {
        documents: [file1, file2],
      };

      const formData = transformToFormData(data);

      expect(formData.get("documents[0]")).toBeInstanceOf(File);
      expect(formData.get("documents[1]")).toBeInstanceOf(File);
      expect((formData.get("documents[0]") as File).name).toBe("file1.txt");
      expect((formData.get("documents[1]") as File).name).toBe("file2.txt");
    });

    it("should handle nested objects", () => {
      const data = {
        user: {
          name: "John",
          email: "john@example.com",
        },
        settings: {
          theme: "dark",
        },
      };

      const formData = transformToFormData(data);

      expect(formData.get("user.name")).toBe("John");
      expect(formData.get("user.email")).toBe("john@example.com");
      expect(formData.get("settings.theme")).toBe("dark");
    });

    it("should handle arrays of objects", () => {
      const data = {
        users: [
          { name: "John", age: 30 },
          { name: "Jane", age: 25 },
        ],
      };

      const formData = transformToFormData(data);

      expect(formData.get("users[0].name")).toBe("John");
      expect(formData.get("users[0].age")).toBe("30");
      expect(formData.get("users[1].name")).toBe("Jane");
      expect(formData.get("users[1].age")).toBe("25");
    });

    it("should handle Date objects", () => {
      const date = new Date("2025-06-15T12:00:00Z");
      const data = {
        startDate: date,
      };

      const formData = transformToFormData(data);

      expect(formData.get("startDate")).toBe(date.toISOString());
    });

    it("should ignore undefined and null values", () => {
      const data = {
        name: "John",
        age: undefined,
        email: null,
        active: true,
      };

      const formData = transformToFormData(data);

      expect(formData.get("name")).toBe("John");
      expect(formData.get("age")).toBeNull();
      expect(formData.get("email")).toBeNull();
      expect(formData.get("active")).toBe("true");
    });

    it("should handle complex nested structures", () => {
      const file = new File(["content"], "avatar.jpg");
      const data = {
        profile: {
          user: {
            name: "John",
            avatar: file,
          },
          settings: {
            notifications: true,
            theme: "dark",
          },
        },
      };

      const formData = transformToFormData(data);

      expect(formData.get("profile.user.name")).toBe("John");
      expect(formData.get("profile.user.avatar")).toBeInstanceOf(File);
      expect(formData.get("profile.settings.notifications")).toBe("true");
      expect(formData.get("profile.settings.theme")).toBe("dark");
    });

    it("should handle arrays with mixed content including files", () => {
      const file = new File(["content"], "doc.pdf");
      const data = {
        items: [
          { name: "Item 1", document: file },
          { name: "Item 2", count: 5 },
        ],
      };

      const formData = transformToFormData(data);

      expect(formData.get("items[0].name")).toBe("Item 1");
      expect(formData.get("items[0].document")).toBeInstanceOf(File);
      expect(formData.get("items[1].name")).toBe("Item 2");
      expect(formData.get("items[1].count")).toBe("5");
    });

    it("should handle empty arrays", () => {
      const data = {
        tags: [],
        items: [],
      };

      const formData = transformToFormData(data);

      // Empty arrays shouldn't add any entries
      const keys = Array.from(formData.keys());
      expect(keys).not.toContain("tags");
      expect(keys).not.toContain("items");
    });

    it("should handle empty objects", () => {
      const data = {};

      const formData = transformToFormData(data);

      const keys = Array.from(formData.keys());
      expect(keys).toHaveLength(0);
    });

    it("should convert numbers and booleans to strings", () => {
      const data = {
        count: 42,
        price: 19.99,
        active: true,
        disabled: false,
      };

      const formData = transformToFormData(data);

      expect(formData.get("count")).toBe("42");
      expect(formData.get("price")).toBe("19.99");
      expect(formData.get("active")).toBe("true");
      expect(formData.get("disabled")).toBe("false");
    });
  });

  describe("prepareRequestData", () => {
    it("should return FormData when files are present", () => {
      const file = new File(["content"], "test.txt");
      const data = {
        name: "Test",
        document: file,
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(true);
      expect(result.data).toBeInstanceOf(FormData);
      expect(result.headers["Content-Type"]).toBe("multipart/form-data");
    });

    it("should return JSON when no files are present", () => {
      const data = {
        name: "Test",
        age: 30,
        email: "test@example.com",
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(false);
      expect(result.data).toEqual(data);
      expect(result.headers["Content-Type"]).toBe("application/json");
    });

    it("should detect files in nested structures", () => {
      const file = new File(["content"], "test.txt");
      const data = {
        profile: {
          user: {
            avatar: file,
          },
        },
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(true);
      expect(result.data).toBeInstanceOf(FormData);
    });

    it("should detect files in arrays", () => {
      const file1 = new File(["content1"], "file1.txt");
      const file2 = new File(["content2"], "file2.txt");
      const data = {
        documents: [file1, file2],
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(true);
      expect(result.data).toBeInstanceOf(FormData);
    });

    it("should return JSON for arrays of primitives", () => {
      const data = {
        tags: ["javascript", "typescript"],
        numbers: [1, 2, 3],
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(false);
      expect(result.data).toEqual(data);
    });

    it("should return JSON for empty objects", () => {
      const data = {};

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(false);
      expect(result.data).toEqual(data);
    });

    it("should return JSON for arrays of objects without files", () => {
      const data = {
        users: [
          { name: "John", age: 30 },
          { name: "Jane", age: 25 },
        ],
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(false);
      expect(result.data).toEqual(data);
    });

    it("should correctly transform data with mixed content", () => {
      const file = new File(["content"], "image.jpg");
      const data = {
        title: "Property Listing",
        price: 1500,
        images: [file],
        features: ["parking", "elevator"],
        address: {
          street: "123 Main St",
          city: "New York",
        },
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(true);
      expect(result.data).toBeInstanceOf(FormData);

      const formData = result.data as FormData;
      expect(formData.get("title")).toBe("Property Listing");
      expect(formData.get("price")).toBe("1500");
      expect(formData.get("images[0]")).toBeInstanceOf(File);
      expect(formData.get("features[0]")).toBe("parking");
      expect(formData.get("address.city")).toBe("New York");
    });
  });

  describe("Integration: Real-world scenarios", () => {
    it("should handle property creation with images", () => {
      const image1 = new File(["img1"], "property1.jpg", {
        type: "image/jpeg",
      });
      const image2 = new File(["img2"], "property2.jpg", {
        type: "image/jpeg",
      });

      const data = {
        name: "Luxury Apartment",
        type: "residential",
        price: 2500,
        address: {
          street: "456 Park Ave",
          city: "New York",
          state: "NY",
        },
        images: [image1, image2],
        amenities: ["pool", "gym", "parking"],
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(true);

      const formData = result.data as FormData;
      expect(formData.get("name")).toBe("Luxury Apartment");
      expect(formData.get("images[0]")).toBeInstanceOf(File);
      expect(formData.get("images[1]")).toBeInstanceOf(File);
      expect(formData.get("amenities[0]")).toBe("pool");
      expect(formData.get("address.city")).toBe("New York");
    });

    it("should handle user profile update with avatar", () => {
      const avatar = new File(["avatar"], "avatar.png", { type: "image/png" });

      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        avatar: avatar,
        settings: {
          notifications: true,
          theme: "dark",
        },
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(true);

      const formData = result.data as FormData;
      expect(formData.get("firstName")).toBe("John");
      expect(formData.get("avatar")).toBeInstanceOf(File);
      expect(formData.get("settings.notifications")).toBe("true");
    });

    it("should handle document upload with metadata", () => {
      const doc = new File(["document"], "lease.pdf", {
        type: "application/pdf",
      });

      const data = {
        document: doc,
        metadata: {
          title: "Lease Agreement",
          type: "legal",
          uploadDate: new Date("2025-06-15"),
          tags: ["lease", "legal", "tenant"],
        },
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(true);

      const formData = result.data as FormData;
      expect(formData.get("document")).toBeInstanceOf(File);
      expect(formData.get("metadata.title")).toBe("Lease Agreement");
      expect(formData.get("metadata.tags[0]")).toBe("lease");
    });

    it("should handle form without files as JSON", () => {
      const data = {
        email: "user@example.com",
        password: "secret123",
        rememberMe: true,
      };

      const result = prepareRequestData(data);

      expect(result.sendAsFormData).toBe(false);
      expect(result.data).toEqual(data);
      expect(result.headers["Content-Type"]).toBe("application/json");
    });
  });
});
