<x-mail::message>
# Disposisi Surat Masuk Baru

Halo **{{ $leaderName }}**,

Anda telah menerima disposisi surat baru dengan detail sebagai berikut:

<x-mail::panel>
**Nomor Surat:** {{ $mailNumber }}  
**Kategori:** {{ $category }}  
**Tanggal Surat:** {{ $date }}
{{ $desc }}
</x-mail::panel>

Silakan login ke aplikasi untuk melihat detail lengkap dan menindaklanjuti surat ini.

Terima kasih,<br>
</x-mail::message>
