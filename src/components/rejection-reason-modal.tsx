'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

const rejectionReasonSchema = z.object({
  reason: z
    .string()
    .min(10, '거부 사유는 최소 10자 이상이어야 합니다')
    .max(500, '거부 사유는 최대 500자 이하여야 합니다'),
})

type RejectionReasonFormValues = z.infer<typeof rejectionReasonSchema>

interface RejectionReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => void | Promise<void>
}

export function RejectionReasonModal({
  isOpen,
  onClose,
  onSubmit,
}: RejectionReasonModalProps) {
  const form = useForm<RejectionReasonFormValues>({
    resolver: zodResolver(rejectionReasonSchema),
    defaultValues: {
      reason: '',
    },
  })

  const handleSubmit = async (values: RejectionReasonFormValues) => {
    try {
      await onSubmit(values.reason)
      form.reset()
      onClose()
    } catch (error) {
      console.error('거부 처리 중 오류:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>거부 사유 입력</DialogTitle>
          <DialogDescription>
            이 항목을 거부하는 이유를 간단히 설명해주세요.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>거부 사유</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="거부 사유를 입력하세요 (10자 이상 500자 이하)"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={form.formState.isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? '제출 중...' : '제출'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
