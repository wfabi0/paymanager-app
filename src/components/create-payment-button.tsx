import { Label } from "@radix-ui/react-dropdown-menu";
import { formatDate, parse } from "date-fns";
import { Calendar, DollarSign } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { dbServices } from "~/modules/database/db-services";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

const generateUUID = (): string => {
  return ((1e7).toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c) =>
      (
        parseInt(c) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] &
          (15 >> (parseInt(c) / 4)))
      ).toString(16)
  );
};

export const formSchema = z.object({
  id: z.string().default(generateUUID()),
  name: z.string().min(3).max(255),
  amount: z
    .string()
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(value))
    .transform((value) => parseFloat(value)),
  dueAt: z.date(),
  status: z.enum(["pending", "paid", "future", "late"]).default("pending"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

interface CreatePaymentButtonProps {
  getPayments: () => Promise<void>;
}

export default function CreatePaymentButton({
  getPayments,
}: CreatePaymentButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [dueAt, setDueAt] = useState<string>("");

  const resetForm = () => {
    setName("");
    setAmount("");
    setDueAt("");
  };

  const handleChangeAmountInput = (_amount: string) => {
    let onlyNumbersAndComma = _amount.replace(/[^\d,]/g, "");
    const commaCount = (onlyNumbersAndComma.match(/,/g) || []).length;
    if (commaCount > 1) return;
    if (
      onlyNumbersAndComma.startsWith(",") ||
      /^(?!.*\d,).*,$/.test(onlyNumbersAndComma)
    )
      return;
    setAmount(onlyNumbersAndComma);
  };

  const checkStatus = (
    date: Date
  ): z.infer<typeof formSchema.shape.status> | void => {
    const now = new Date();
    const due = date;
    if (now.getDay() === due.getDay() && now <= due) return "pending";
    if (now > due) return "late";
    if (now < due) return "future";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    event.preventDefault();
    const parseDate = dueAt.includes(":")
      ? parse(dueAt, "dd/MM/yyyy HH:mm", new Date())
      : parse(dueAt, "dd/MM/yyyy", new Date());
    const body = {
      name,
      amount: amount.replace(",", "."),
      dueAt: parseDate,
      status: checkStatus(parseDate),
    };
    const check = formSchema.safeParse(body);
    if (check.success) {
      const finalValue = formSchema.parse(body);
      const data = await dbServices.createSetting(finalValue.name, finalValue);
      if (data?.key) {
        resetForm();
        setOpen(false);
        setIsSubmitting(false);
        toast.success("Payment created successfully.");
        await getPayments();
      } else {
        setIsSubmitting(false);
        setOpen(false);
        return toast.error(
          data.message || "An error occurred while creating the payment."
        );
      }
    } else {
      setIsSubmitting(false);
      setOpen(false);
      return toast.error("Your input is invalid. Please check again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create New Payment"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form autoComplete="off" className="space-y-8" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Payment</DialogTitle>
            <DialogDescription>
              Enter the payment details below to create a new payment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-y-2.5">
            <div className="space-y-1">
              <Label className="font-medium">Name</Label>
              <Input
                id="name"
                name="name"
                className="w-full"
                placeholder="Your payment name."
                type="text"
                required
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="font-medium">Amount</Label>
              <div className="relative flex-1 md:grow-0">
                <DollarSign className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  name="amount"
                  className="w-full pl-8"
                  placeholder="Your payment amount. | Ex: 19,99"
                  type="text"
                  required
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => handleChangeAmountInput(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="font-medium">Due At</Label>
              <div className="relative flex-1 md:grow-0">
                <Calendar className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dueAt"
                  name="dueAt"
                  className="w-full pl-8"
                  placeholder={`Your payment due date. | Ex: ${formatDate(
                    new Date(),
                    "dd/MM/yyyy HH:mm"
                  )}`}
                  type="text"
                  required
                  autoComplete="off"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-y-2">
            <Button
              type="reset"
              variant={"outline"}
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
