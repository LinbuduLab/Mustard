import { describe, it, expect, vi, beforeEach } from "vitest";
import { ZodError } from "zod";
import { Validator } from "../Validators";

enum VE {
  Foo,
}

describe("Validators", () => {
  it("should mark as optional by default", () => {
    expect(Validator.required).toBeFalsy();
    expect(Validator.Required().required).toBeTruthy();
    expect(Validator.Optional().required).toBeFalsy();
  });
  it("should produce REQUIRED Validator", () => {
    try {
      expect(Validator.Required().String().validate(undefined));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Required().Boolean().validate(undefined));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Required().Number().validate(undefined));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Required().Enum(VE).validate(undefined));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  });

  it("should produce OPTIONAL Validator", () => {
    expect(Validator.String().validate("str")).toBe("str");
    expect(Validator.Boolean().validate(true)).toBeTruthy();
    expect(Validator.Number().validate(599)).toBe(599);
    expect(Validator.Enum(VE).validate(0)).toBe(0);
    expect(Validator.Enum(VE).validate(VE.Foo)).toBe(VE.Foo);

    try {
      expect(Validator.Required().String().validate(null));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Required().Boolean().validate(null));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Required().Number().validate(null));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Required().Enum(VE).validate(null));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  });
});

describe("Validators.String", () => {
  it("should validate string primitive", () => {
    expect(Validator.String().validate("str")).toBe("str");
    try {
      expect(Validator.String().Length(6).validate("str"));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.String().StartsWith("foo").validate("str"));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.String().EndsWith("foo").validate("str"));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.String().MinLength(6).validate("str"));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.String().MaxLength(1).validate("str"));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.String().Email().validate("str"));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  });
});

describe("Validators.Number", () => {
  it("should validate number primitive", () => {
    try {
      expect(Validator.Number().Positive().validate(-1));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Number().NonPositive().validate(1));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Number().Negative().validate(-1));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Number().NonNegative().validate(1));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Number().Int().validate(1.89));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Number().Gt(10).validate(-1));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Number().Gte(10).validate(-1));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Number().Lt(10).validate(11));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }

    try {
      expect(Validator.Number().Lte(10).validate(11));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  });
});

describe("Validators.Enum", () => {
  it("should validate native enum type", () => {
    try {
      expect(Validator.Enum(VE).validate(11));
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  });
});
