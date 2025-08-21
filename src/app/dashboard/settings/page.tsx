
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSettings, Settings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  temp: z.object({
    warning: z.number(),
    danger: z.number(),
  }),
  humidity: z.object({
    warning: z.number(),
    danger: z.number(),
  }),
  small_dust: z.object({
    warning: z.number(),
    danger: z.number(),
  }),
  large_dust: z.object({
    warning: z.number(),
    danger: z.number(),
  }),
});

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: settings,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSettings(values);
    toast({
      title: "Settings saved!",
      description: "Your alert thresholds have been updated.",
    });
  }
  
  const renderSlider = (name: keyof Settings, type: "warning" | "danger", min: number, max: number, step: number) => (
      <FormField
        control={form.control}
        name={`${name}.${type}`}
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel className="capitalize">{t(type as any)}</FormLabel>
              <span className="text-sm font-medium">{value}</span>
            </div>
            <FormControl>
               <Slider
                  value={[value]}
                  onValueChange={(vals) => onChange(vals[0])}
                  min={min}
                  max={max}
                  step={step}
                />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
  );


  return (
    <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>{t('settings')}</CardTitle>
                <CardDescription>
                {t('settingsDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                       <Card>
                         <CardHeader>
                            <CardTitle className="text-lg">{t('temp')}</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                            {renderSlider('temp', 'warning', 15, 40, 0.5)}
                            {renderSlider('temp', 'danger', 15, 40, 0.5)}
                         </CardContent>
                       </Card>

                       <Card>
                         <CardHeader>
                            <CardTitle className="text-lg">{t('humidity')}</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                            {renderSlider('humidity', 'warning', 50, 90, 1)}
                            {renderSlider('humidity', 'danger', 50, 90, 1)}
                         </CardContent>
                       </Card>

                       <Card>
                         <CardHeader>
                            <CardTitle className="text-lg">{t('small_dust')}</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                            {renderSlider('small_dust', 'warning', 10, 100, 1)}
                            {renderSlider('small_dust', 'danger', 10, 100, 1)}
                         </CardContent>
                       </Card>
                       
                       <Card>
                         <CardHeader>
                            <CardTitle className="text-lg">{t('large_dust')}</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                            {renderSlider('large_dust', 'warning', 10, 100, 1)}
                            {renderSlider('large_dust', 'danger', 10, 100, 1)}
                         </CardContent>
                       </Card>
                        
                        <div className="flex justify-end">
                            <Button type="submit">{t('saveChanges')}</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
